import express from 'express';
import authRotes from "./routes/authRotes.js"
import uploadRotes from "./routes/uploadRotes.js"
import { connectKafka } from './Producer.js';
import userRoutes from "./routes/userRotes.js"

const app = express();
app.use(express.json())
connectKafka();
// app.use('/', (req, res) => {
//     res.send('Home   Job Portal')
// })
app.use('/api/auth', authRotes)
app.use('/api/upload', uploadRotes)
app.use('/api/user', userRoutes)
export default app;