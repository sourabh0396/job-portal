import express from 'express';
import authRotes from "./routes/authRotes.js"
import uploadRotes from "./routes/uploadRotes.js"
import { connectKafka } from './Producer.js';
import userRoutes from "./routes/userRotes.js";
import jobRotes from "./routes/jobRotes.js";
import genAiRoutes from "./routes/genAiRoutes.js"
const app = express();
app.use(express.json())
connectKafka();
// app.use('/', (req, res) => {
//     res.send('Home   Job Portal')
// })
app.use('/api/auth', authRotes);
app.use('/api/upload', uploadRotes);
app.use('/api/user', userRoutes);
app.use('/api/job', jobRotes);
app.use('/api/ai', genAiRoutes);
export default app;