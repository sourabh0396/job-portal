import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

export const SQL = neon(process.env.DATABASE_URL as string);