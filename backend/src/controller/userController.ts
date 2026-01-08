import { buffer } from "node:stream/consumers";
import { AuthenticatedRequest } from "../middleware/UserAuth.js";
import getBuffer from "../utils/Buffer.js";
import { SQL } from "../utils/DB.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import uploadFile from "../middleware/multer.js";
import axios from "axios";
import cloudinary from "../Config/CloudinaryConfig.js";
import { application } from "express";



export const MyProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    res.json(user)

})

export const getUserProfile = TryCatch(async (req, res, next) => {
    const { userId } = req.params;
    const users = await SQL`
            SELECT u.user_id, 
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
            COALESCE(ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
          FROM users u
          LEFT JOIN user_skills us ON u.user_id = us.user_id
          LEFT JOIN skills s ON us.skill_id = s.skill_id
          WHERE u.user_id = ${userId}
          GROUP BY u.user_id;
        `;

    if (users.length === 0) {
        throw new ErrorHandler(404, "User Not Found")
    }
    const user = users[0]
    user.skills = user.skills || []

    res.json(user)
})

export const updatedUserProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication required");
    }
    const { name, phoneNumber, bio } = req.body;
    const newName = name || user.name;
    const newPhoneNumber = phoneNumber || user.phone_number;
    const newBio = bio || user.bio;

    const [updatedUser] = await SQL`
    UPDATE users SET name = ${newName}, phone_number = ${newPhoneNumber}, bio = ${newBio}
    WHERE user_id = ${user.user_id}
    RETURNING user_id,name,email,phone_number,bio
    `;

    res.json({
        message: "Profile updates sucessfully",
        updatedUser
    })
});

export const updateProfilePic = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication required");
    }
    const file = req.file;
    if (!file) {
        throw new ErrorHandler(400, "No image provided");
    }
    const oldProfileId = user.profile_pic_public_id;
    const fileBuffor = getBuffer(file);
    if (!fileBuffor || !fileBuffor.content) {
        throw new ErrorHandler(500, "failed to generate buffer");
    }
    interface UploadResponse {
        //We add UploadResponse to tell TypeScript what the server will send back.
        // Without it, TypeScript says: “I don’t know what this data is → it’s unknown.”
        url: string;
        public_id: string;
    }
    const { data: uploadResult } = await axios.post<UploadResponse>(`http://localhost:5000/api/upload/upload`, {
        buffer: fileBuffor.content,
        public_id: oldProfileId,
    });
    const [updatedUser] = await SQL`
    UPDATE users SET profile_pic =${uploadResult.url}, profile_pic_public_id=${uploadResult.public_id}
    WHERE user_id =${user.user_id} RETURNING user_id,name,profile_pic;
    `;

    res.json({
        message: "profile pic updated",
        updatedUser
    });
});


export const updateResume = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication required");
    }
    const file = req.file;
    if (!file) {
        throw new ErrorHandler(400, "No PDF provided");
    }
    if (file.mimetype !== "application/pdf") {
        throw new ErrorHandler(400, "Only PDF files are allowed");
    }
    // Delete old resume if exists
    if (user.resume_public_id) {
        await cloudinary.uploader.destroy(user.resume_public_id, {
            resource_type: "raw",
        });
    }

    // Upload new resume (PDF)

    const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64File, {
        resource_type: "raw",
        folder: "resumes",
    });
    // Update DB
    const [updatedUser] = await SQL`
        UPDATE users SET resume = ${uploadResult.secure_url}, resume_public_id = ${uploadResult.public_id}
        WHERE user_id = ${user.user_id} RETURNING user_id, name, resume;
    `;

    res.json({
        message: "Resume updated",
        updatedUser
    })
});


export const addSkilltoUser = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.user_id;
    const { skillName } = req.body;
    if (!skillName || skillName.trim === "") {
        throw new ErrorHandler(400, "plese Provide a skill name")
    }
    let wasSkillAdded = false;
    try {
        await SQL`BEGIN`;
        const users = await SQL`SELECT user_id FROM users WHERE user_id=${userId}`;
        if (users.length === 0) {
            throw new ErrorHandler(400, 'User Not found');
        }

        const [skill] = await SQL`INSERT INTO skills (name) VALUES (${skillName.trim()}) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING skill_id`;

        const skillId = skill.skill_id;
        const insertionResult = await SQL`INSERT INTO user_skills (user_id,skill_id) VALUES (${userId},${skillId}) ON CONFLICT (user_id,skill_id) DO NOTHING RETURNING user_id`;
        if (insertionResult.length > 0) {
            wasSkillAdded = true;
        }
        await SQL`COMMIT`;
    } catch (error) {
        await SQL`ROLLBACK`;
        throw error;
    }
    if (!wasSkillAdded) {
        return res.status(200).json({
            message: "User already posses this skills",
        })
    }
    res.json({
        message: `skill ${skillName.trim()} is added successfully`,
    });
});

export const deleteSkillFromUser = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, 'Authentication Required');
    }
    const { skillName } = req.body;
    if (!skillName || skillName.trim() === "") {
        throw new ErrorHandler(401, 'Plese provide a skill name');
    }

    const result = await SQL` DELETE FROM user_skills WHERE user_id =${user.user_id} 
    AND skill_id =(SELECT skill_id FROM skills WHERE name=${skillName.trim()}) RETURNING user_id`;

    if (result.length === 0) {
        throw new ErrorHandler(404, `Skill ${skillName.trim()} was Not Found`);
    }
    res.json({
        message: `Skill ${skillName.trim()} was deleted sucessfully`,
    });
});


export const applyToJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication Required");
    }
    if (user.role !== "jobseeker") {
        throw new ErrorHandler(403, "Forbidden: You are not allowed to apply the job");
    }
    const applicant_id = user.user_id;
    const resume = user.resume;
    if (!resume) {
        throw new ErrorHandler(403, "You need to add resume in your profile to apply this job");
    }
    const { job_id } = req.body;
    if (!job_id) {
        throw new ErrorHandler(400, "job id is required")
    }
    const [job] = await SQL`SELECT is_active FROM jobs WHERE job_id =${job_id}`;
    if (!job) {
        throw new ErrorHandler(400, "No jobs with this id");
    }
    if (!job.is_active) {
        throw new ErrorHandler(400, "This jobs is Not active");
    }
    let newApplication;
    try {
        [newApplication] = await SQL`INSERT INTO applications(job_id, applicant_id, applicant_email, resume, subscribed)
        VALUES (${job_id},${applicant_id},${user?.email},${resume}
        )`
    } catch (error: any) {
        // 23505 is a PostgreSQL error code
        // It means unique_violation
        // This happens when we try to insert a duplicate value into a column (or combination of columns) that has a UNIQUE constraint
        if (error.code === '23505') {
            throw new ErrorHandler(409, "You have already applied to this job");
        }
        throw error;
    }

    res.json({
        message: "Applied for job sucessfully",
        application: newApplication
    })
});



export const getAllApplications = TryCatch(async (req: AuthenticatedRequest, res) => {

    const applications = await SQL`
    SELECT 
    a.*,
    j.title AS job_title,
    j.salary AS job_salary,
    j.location AS job_location
    FROM applications a
    JOIN jobs j ON a.job_id = j.job_id
    WHERE a.applicant_id = ${req.user?.user_id}
    `;
    res.json({
        message: "Applied Jobs fetched Sucessfully",
        applications
    })
});