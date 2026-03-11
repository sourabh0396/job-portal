import express from "express";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoute from './routes/paymentRoute.js'
dotenv.config()

export const instnase = new Razorpay({
    key_id: process.env.RazorPayKey,
    key_secret: process.env.RazorPayKey_secret,
})


const app = express()

app.use(cors());
app.use(express.json());
app.use('/api/payment', paymentRoute);


let PORT = 8000;
app.listen(PORT, () => {
    console.log(`Payment Service appication is running on http://localhost:${PORT}`)
})
