import { buffer } from "node:stream/consumers";
import { AuthenticatedRequest } from "../middleware/UserAuth.js";
import getBuffer from "../utils/Buffer.js";
import { SQL } from "../utils/DB.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import { compare } from "bcrypt";
import axios from "axios";
import cloudinary from "../Config/CloudinaryConfig.js";

export const createCompany = TryCatch(async (req: AuthenticatedRequest, res) => {

    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, 'Authentication Required')
    }
    if (user.role !== 'recruiter') {
        throw new ErrorHandler(400, 'Forbidden: Only Recrutier can create a company')
    }

    const { name, description, website } = req.body;
    if (!name || !description || !website) {
        throw new ErrorHandler(400, "All fields required")
    }

    const existingCompanies = await SQL`SELECT company_id FROM companies WHERE name=${name}`;
    if (existingCompanies.length > 0) {
        throw new ErrorHandler(400, `A company with name ${name} already exists`);
    }

    const file = req.file
    if (!file) {
        throw new ErrorHandler(400, 'Company Logo is Required');
    }

    const fileBuffor = getBuffer(file);
    if (!fileBuffor || !fileBuffor.content) {
        throw new ErrorHandler(500, 'Failed to create file buffor');
    }
    // interface UploadResponse {
    //     url: string;
    //     public_id: string;
    // }
    // const { data } = await axios.post<UploadResponse>(`http://localhost:5000/api/upload/upload`,
    //     { buffer: fileBuffor.content }
    // );
    const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "company_logos" } // optional folder for organization
    );

    const [newCompany] = await SQL`INSERT INTO companies (name,description,website,logo,logo_public_id,recruiter_id)
    VALUES (${name},${description},${website},${uploadResult.url},${uploadResult.public_id},${req.user?.user_id}) RETURNING *`;

    res.json({
        message: "Company created sucessfuly",
        company: newCompany
    })
})

export const deleteCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    // const { companyId } = req.body;
    const { companyId } = req.params;


    const [company] = await SQL`SELECT logo_public_id FROM companies WHERE company_id=${companyId}
    AND recruiter_id = ${user?.user_id}`;

    if (!company) {
        throw new ErrorHandler(404, "This company not found or You are not authorized to Delete this company")
    }
    await SQL`DELETE FROM companies WHERE company_id=${companyId}`;
    res.json({
        message: "Company and all associated jobs have been deleted"
    })
});

export const createJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(400, 'Authentication required');
    }
    if (user.role !== 'recruiter') {
        throw new ErrorHandler(400, "Forbidden: Only recruiter can create a company");
    }

    const { title, description, salary, location, job_type, openings, role, work_location, company_id } = req.body;
    if (!title || !description || !salary || !location || !openings || !role) {
        throw new ErrorHandler(401, 'All fields are required');
    }

    const company = await SQL`SELECT company_id FROM companies WHERE  company_id =${company_id}
    AND recruiter_id =${user.user_id}`;

    if (!company) {
        throw new ErrorHandler(400, "Company not found");
    }

    const newJob = await SQL`INSERT INTO jobs(title,description,salary,location,role,job_type,
    work_location,company_id,posted_by_recruiter_id,openings)
    VALUES (${title},${description},${salary},${location},${role},${job_type},${work_location},
    ${company_id},${user.user_id},${openings}) RETURNING *`;

    res.json({
        message: "job posted sucessfully",
        job: newJob
    })

})

export const updateJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(400, "Authentication required");
    }
    const { title, description, salary, location, job_type, openings, role, work_location, company_id, is_active } = req.body;
    const [existingJob] = await SQL` SELECT posted_by_recruiter_id from jobs WHERE job_id=${req.params.jobId}`;
    if (!existingJob) {
        throw new ErrorHandler(404, 'Job not found');
    }
    if (existingJob.posted_by_recruiter_id !== user.user_id)
        throw new ErrorHandler(403, 'Forbidden: You are not allowed');

    const [updatedJob] = await SQL`UPDATE jobs SET title=${title}, description=${description}, salary=${salary}, 
    location=${location}, role=${role}, job_type=${job_type}, work_location=${work_location}, company_id=${company_id}, 
    openings=${openings}, is_active=${is_active} WHERE job_id=${req.params.jobId} RETURNING *`;

    res.json({
        message: "Job updated Sucessfully",
        job: updatedJob
    })
})


export const getAllCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        throw new ErrorHandler(401, "Authentication required");
    }
    const companies = await SQL`
        SELECT * 
        FROM companies 
        WHERE recruiter_id = ${req.user?.user_id}`;

    res.json({
        message: "all companies fetched",
        companies
    })
})

export const getCompanyDetails = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorHandler(404, 'companie is required');
    }
    const [companyData] = await SQL`SELECT c.*, COALESCE (
        (
            SELECT json_agg(j.*) FROM jobs j WHERE j.company_id = c.company_id
        ),
            '[]'::json 
    ) AS jobs
    FROM companies c WHERE c.company_id=${id} GROUP BY c.company_id;`;
    if (!companyData) {
        throw new ErrorHandler(404, 'Company Not Found');
    }
    res.json({
        companyData
    });
});

export const getAllActiveJobs = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { title, location } = req.query as {
        title?: string;
        location?: string;
    }

    let quesryString = ` SELECT j.job_id, j.title , j.description, j.salary, j.location, j.job_type, 
    j.openings, j.role, j.work_location, j.created_at, c.name AS company_name, c.logo AS company_logo,
     c.company_id AS company_id FROM jobs j 
     JOIN companies c ON j.company_id = c.company_id WHERE j.is_active =true`;

    const values = [];
    let paramIndex = 1;
    if (title) {
        quesryString += ` AND j.title ILIKE $${paramIndex}`;
        values.push(`%${title}%`);
        paramIndex++;
    }
    if (location) {
        quesryString += ` AND j.location ILIKE $${paramIndex}`; //the first $ is Literal character and second ${paramIndex} JS interpolation
        values.push(`%${location}%`);
        paramIndex++;
    }
    quesryString += " ORDER BY j.created_at DESC";
    const jobs = (await SQL.query(quesryString, values)) as any[];
    res.json(jobs);
});


export const getSingleJob = TryCatch(async (req, res) => {
    const [job] = await SQL`SELECT * FROM jobs WHERE job_id=${req.params.jobId}`;
    res.json({ message: "job fetched sucessfully", job })
});



