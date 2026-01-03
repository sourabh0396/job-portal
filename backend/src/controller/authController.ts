import { Request, Response } from "express"
import { TryCatch } from "../utils/TryCatch.js"
import ErrorHandler from "../utils/errorHandler.js";
import { SQL } from "../utils/DB.js";
import bcrypt from 'bcrypt'
import getBuffer from "../utils/Buffer.js";
import axios from "axios";
import { buffer } from "node:stream/consumers";
import cloudinary from "../Config/CloudinaryConfig.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { forgotPasswordTemplate } from "../Kafka/templete.js";
import { publishTOTopic } from "../Producer.js";
import { redisClient } from "../index.js";
import { emit } from "node:cluster";
dotenv.config();
// export default function registerUser(req: Request, res: Response) {
//     try { } catch (error: any) { res.status(500).json({ message: error.message }) }
// }

export const registerUser = TryCatch(async (req, res, next) => {
    const { name, email, password, phoneNumber, role, bio } = req.body;
    if (!name || !email || !password || !phoneNumber || !role) {
        throw new ErrorHandler(400, 'Plese fill all details');
    }
    const userExists = await SQL`SELECT user_id FROM users WHERE email=${email}`
    if (userExists.length > 0) {
        throw new ErrorHandler(400, 'User with this email already Exists')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    var registeredUser;
    if (role === 'recruiter') {
        const [user] = await SQL`INSERT INTO users(name,email,password,phone_number,role)
        VALUES (${name},${email},${hashPassword},${phoneNumber},${role}) 
        RETURNING user_id,name,email,phone_number, role,created_at`;


        registeredUser = user;
    } else if (role === 'jobseeker') {
        const file = req.file;
        if (!file) {
            throw new ErrorHandler(400, 'Resume file is required for jobseekers')
        }
        const filBuffer = getBuffer(file);
        if (!filBuffer || !filBuffer.content) {
            throw new ErrorHandler(500, 'Failed to generated buffer')
        }

        // const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/upload`, {
        //     buffer: filBuffer.content
        // })
        const data = await cloudinary.uploader.upload(
            filBuffer.content,
            { resource_type: 'auto', folder: 'resumes' }
        );
        const [user] = await SQL`INSERT INTO users(name,email,password,phone_number,role,bio,resume,resume_public_id)
        VALUES (${name},${email},${hashPassword},${phoneNumber},${role},${bio},${data.url},${data.public_id}) 
        RETURNING user_id, name, email, phone_number, role, bio, resume, created_at`;


        registeredUser = user;
    }

    const token = jwt.sign(
        { id: registeredUser?.user_id },
        process.env.JWT_SEC as string,
        {
            expiresIn: '1h',
        }
    )

    res.status(201).json({
        message: "User Registered ",
        success: true,
        user: registeredUser,
        token
    });
})


export const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler(400, 'Plese fill all details')
    }
    // const user = await SQL`
    // SELECT u.user_id, u.name, u.email, u.password, u.phone_number, u.role, u.bio, u.resume, u.profile_pic, 
    // u.subscription, ARRAY_AGG(s.name) FILTER (WHERE s.name is NOT NULL ) 
    // as skills FROM users u LEFT JOIN user_skills us ON u.user_id = u.user_id LEFT JOIN 
    // skills s ON user.skill_id = s.skill_id 
    // WHERE u.email = ${email} GROUP BY u.user_id
    // `;
    const user = await SQL`
            SELECT 
            u.user_id,
            u.name,
            u.email,
            u.password,
            u.phone_number,
            u.role,
            u.bio,
            u.resume,
            u.profile_pic,
            u.subscription,
            COALESCE(ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
            FROM users u
            LEFT JOIN user_skills us ON u.user_id = us.user_id
            LEFT JOIN skills s ON us.skill_id = s.skill_id
            WHERE u.email = ${email}
            GROUP BY u.user_id;
            `;
    if (user.length === 0) {
        // throw new ErrorHandler(400,'Invalid Credentials');
        throw new ErrorHandler(400, 'Invalid email or password.Please check your credentials and try again.');
    }
    const userObject = user[0];
    const matchPassword = await bcrypt.compare(password, userObject.password)
    if (!matchPassword) {
        throw new ErrorHandler(400, 'Invalid Credentials, Please check your Password');
    }
    userObject.skills = userObject.skills || [];
    delete userObject.password;



    const token = jwt.sign(
        { id: userObject?.user_id },
        process.env.JWT_SEC as string,
        {
            expiresIn: '2h',
        }
    )

    res.status(201).json({
        message: "User Registered ",
        success: true,
        user: userObject,
        token
    });
})



export const forgotPassword = TryCatch(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new ErrorHandler(400, 'Email is required')
    }
    const users = await SQL`SELECT user_id, email FROM users WHERE email=${email}`

    if (users.length === 0) {
        return res.json({
            message: "If email exists, we have sent a reset link",
        })
    };
    const user = users[0];

    const resetToken = jwt.sign({
        email: user.email,
        type: "reset",
    },
        process.env.JWT_SEC as string, { expiresIn: '15m' }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    await redisClient.set(`forgot:${email}`, resetToken, {
        EX: 900
    })

    await redisClient.set(`forgot:${email}`, resetToken, {
        EX: 900,
    })
    const message = {
        to: email,
        subject: 'RESET your Password - hiresp',
        html: forgotPasswordTemplate(resetLink),
    }

    publishTOTopic("send-mail", message);
    res.json({
        message: "If email exists, we have sent a reset link",
    });
});

export const resetPassword = TryCatch(async (req, resetPassword, next) => {
    const { token } = req.params;
    const { password } = req.body;

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SEC as string);

    } catch (error) {
        throw new ErrorHandler(400, 'Expired token')
    }

    if (decoded.type !== 'reset') {
        throw new ErrorHandler(400, 'Invalid token type')
    }

    const email = decoded.email
    const storedToken = await redisClient.get(`forgot:${email}`)
    if (!storedToken || storedToken !== token) {
        throw new ErrorHandler(400, 'token has ben expired');
    }

    const users = await SQL` SELECT user_id FROM users WHERE email=${email}`;
    if (users.length === 0) {
        throw new ErrorHandler(404, "User not found");
    }
    const user = users[0]
    const hashPassword = await bcrypt.hash(password, 10)
    await SQL`UPDATE users SET password =${hashPassword} WHERE user_id =${user.user_id} `;
    await redisClient.del(`forgot:${email}`);
    resetPassword.json({ message: "Password changed Sucessfully" })

}) 