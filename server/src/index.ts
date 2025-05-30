import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'

import mongoose from 'mongoose'
import boardRoutes from './routes/board.routes'
import taskRoutes from './routes/task.routes'
import aiRoutes from './routes/ai.routes'



const app=express();
const PORT=process.env.PORT||5000;

app.use(cors());
app.use(express.json());

app.use("/api/boards",boardRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/ai",aiRoutes)

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: any) => console.error(err));