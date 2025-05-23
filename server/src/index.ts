import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import boardRoutes from './routes/board.routes'
import taskRoutes from './routes/task.routes'

dotenv.config();

const app=express();
const PORT=process.env.PORT||5000;

app.use(cors());
app.use(express.json());

app.use("/api/boards",boardRoutes)
app.use("/api/tasks",taskRoutes)
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));