import JsonWebToken from "jsonwebtoken";
import { SQL } from "../utils/DB.js";
export const isUserAuth = async (req, res, next) => {
    try {
        const userAuthHeadeer = req.headers.authorization;
        if (!userAuthHeadeer
            // || !userAuthHeadeer.startsWith("Bearer ")
            || !userAuthHeadeer.toLowerCase().startsWith("bearer ")) {
            res.status(401).json({
                message: "Authorization header is missing or invaid"
            });
            return;
        }
        const token = userAuthHeadeer.split(" ")[1];
        const decodedPayload = JsonWebToken.verify(token, process.env.JWT_SEC);
        if (!decodedPayload || !decodedPayload.id) {
            res.status(401).json({ message: "Invalid token or payload not decoded" });
            return;
        }
        // const users = await SQL`SELECT u.user_id, u.name, u.email, u.phone_number, u.role, u.bio, u.resume, u.resume_public_id, u.profile_pic, u.profile_pic_public_id, u.skills, u.subscription,
        // ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills 
        // FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id
        // LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.user_id =${decodedPayload.id} 
        // GROUP BY u.user_id;
        // `;
        const users = await SQL `
        SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone_number,
        u.role,
        u.bio,
        u.resume,
        u.resume_public_id,
        u.profile_pic,
        u.profile_pic_public_id,
        u.subscription,
        COALESCE(
          ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL),
          '{}'
        ) AS skills
      FROM users u
      LEFT JOIN user_skills us ON u.user_id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.skill_id
      WHERE u.user_id = ${decodedPayload.id}
      GROUP BY u.user_id;
    `;
        if (users.length === 0) {
            res.status(401).json({
                message: "user associated with this token no longrt exists"
            });
            return;
        }
        const user = users[0];
        user.skills = user.skills || [];
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Authentication Failed. plese login again"
        });
    }
};
