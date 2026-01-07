import { SQL } from "../utils/DB.js";

export async function initJobPortalDB() {
    try {
        await SQL`DO $$
        BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='job_type') THEN
        CREATE TYPE job_type as ENUM('Full-time','Part-time','Contract','Intrenship');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='work_location') THEN
        CREATE TYPE work_location as ENUM('On-site','Remote','Hybrid');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='application_status') THEN
        CREATE TYPE application_status as ENUM('Submited','Rejected','Hired');
        END IF;
        END$$;
    `;

        await SQL`
        CREATE TABLE IF NOT EXISTS companies (
        company_id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        website VARCHAR(255) NOT NULL,
        logo VARCHAR(255) NOT NULL,
        logo_public_id VARCHAR(255) NOT NULL,
        recruiter_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;


        await SQL`
        CREATE TABLE IF NOT EXISTS jobs (
        job_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        salary NUMERIC(10,2),
        location VARCHAR(255),
        job_type job_type NOT NULL,  -- Used ENUM 
        openings NUMERIC(3,1) NOT NULL,
        role VARCHAR(255) NOT NULL,
        work_location work_location NOT NULL,  -- Used ENUM 
        company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
        posted_by_recruiter_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `;

        await SQL`
      CREATE TABLE IF NOT EXISTS applications (
        application_id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
        applicant_id INTEGER NOT NULL,  -- Assuming this references users(user_id)
        applicant_email VARCHAR(255) NOT NULL,
        status application_status NOT NULL DEFAULT 'Submited',  -- Used ENUM 
        resume VARCHAR(255) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscribed BOOLEAN,
        UNIQUE(job_id,applicant_id)
      )
    `;
        // await SQL`DROP TABLE IF EXISTS applications`;
        // await SQL`DROP TABLE IF EXISTS jobs`;
        // await SQL`DROP TABLE IF EXISTS companies`;
        console.log('📅 Job ,companies,applications tables initialized/created successfully');
    } catch (error) {
        console.error('❌ Error while creating tables:', error);
        process.exit(1);
    }
}



// import { SQL } from "../utils/DB.js";

// export async function initJobPortalDB() {
//     try {
//         await SQL`
//       CREATE TABLE IF NOT EXISTS companies (
//         company_id SERIAL PRIMARY KEY,
//         name VARCHAR(255) UNIQUE NOT NULL,
//         description TEXT,
//         website VARCHAR(255),
//         logo VARCHAR(255),
//         logo_public_id VARCHAR(255),
//         recruiter_id INTEGER,
//         created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
//       )
//     `;

//         await SQL`
//       CREATE TABLE IF NOT EXISTS jobs (
//         job_id SERIAL PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         salary DECIMAL,
//         location VARCHAR(255),
//         job_type VARCHAR(50),  -- Use ENUM if you want to create one
//         openings DECIMAL,
//         role VARCHAR(255),
//         work_location VARCHAR(50),  -- Use ENUM if you want to create one
//         company_id INTEGER REFERENCES companies(company_id) ON DELETE CASCADE,
//         posted_by_recruiter_id INTEGER,
//         created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
//         is_active BOOLEAN DEFAULT TRUE
//       )
//     `;

//         await SQL`
//       CREATE TABLE IF NOT EXISTS applications (
//         application_id SERIAL PRIMARY KEY,
//         job_id INTEGER REFERENCES jobs(job_id) ON DELETE CASCADE,
//         applicant_id INTEGER,  -- Assuming this references users(user_id)
//         status VARCHAR(50),  -- Use ENUM if you want to create one
//         resume VARCHAR(255),
//         applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
//         subscribed BOOLEAN DEFAULT FALSE
//       )
//     `;

//         console.log('📅 Job portal tables initialized/created successfully');
//     } catch (error) {
//         console.error('❌ Error initializing job portal database tables:', error);
//         process.exit(1);
//     }
// }
