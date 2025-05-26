import mongoose, { Document, Schema } from "mongoose";

export interface ISubtask{
  title:string;
  done:boolean;
}

export interface ITask extends Document {
  name: string;
  description: string;
  icon: string;
  status: "In Progress" | "Completed" | "Won't do" | "To Do";
  boardId: mongoose.Types.ObjectId;
  dueDate?: Date;
  completion?: number; // ✅ New field
  subtasks:ISubtask[];
}

const TaskSchema = new Schema<ITask>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "📘" },
    status: {
      type: String,
      enum: ["In Progress", "Completed", "Won't do", "To Do"],
      default: "To Do",
    },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    dueDate: { type: Date },
    completion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // ✅ Default to 0%
    },
    subtasks: [
      {
        title: { type: String, required: true },
        done: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
