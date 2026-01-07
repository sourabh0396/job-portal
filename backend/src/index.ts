import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { SQL } from "./utils/DB.js";
import { startSendMailConsumer } from "./Kafka/consumer.js";
import { createClient } from "redis";
import { error } from "node:console";
import { initJobPortalDB } from "./module/jobModule.js";

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient.connect()
    .then(() => console.log('✅connected to redis'))
    .catch((error) => {
        console.error(error, '❌ unable to connect redis');
    })


async function initDB() {
    try {
        await SQL`
        DO $$
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                CREATE TYPE user_role as ENUM ('jobseeker','recruiter');
            END IF ;
        END $$;
        `;

        await SQL`
        CREATE TABLE IF NOT EXISTS users(
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            role user_role NOT NULL,
            bio TEXT,
            resume VARCHAR(255),
            resume_public_id VARCHAR(255),
            profile_pic VARCHAR(255),
            profile_pic_public_id VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            subscription TIMESTAMPTZ
        )
        `;


        await SQL`
        CREATE TABLE IF NOT EXISTS skills(
            skill_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        )
        `;

        await SQL`
        CREATE TABLE IF NOT EXISTS user_skills(
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
            PRIMARY KEY (user_id,skill_id)
        )
        `;



        await initJobPortalDB();    // Calling the new job tables initializer
        console.log('📅 Database table initialize/created sucessfully');

    } catch (error) {
        console.log('❌ Error initializing database', error);
        process.exit(1);

    }
}


startSendMailConsumer()



initDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`App is running on http://localhost:${process.env.PORT}`);
    });
})

// app.listen(process.env.PORT, () => {
//     console.log(`App is running on http://localhost:${process.env.PORT}`);
// });
