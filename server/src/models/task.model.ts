// models/task.model.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubtask extends Document {
  title: string;
  done: boolean;
}

export interface ITask extends Document {
  boardId: string;
  name: string;
  description: string;
  icon: string;
  dueDate: Date;
  subtasks: Types.DocumentArray<ISubtask>; // Use DocumentArray for subdocuments
  status: "To Do" | "In Progress" | "Completed" | "Won't do";
  completion: number;
}

const SubtaskSchema = new Schema<ISubtask>({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const TaskSchema = new Schema<ITask>({
  boardId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  icon: String,
  dueDate: Date,
  subtasks: [SubtaskSchema], // ✅ Subdocuments
  status: { type: String, enum: ["To Do", "In Progress", "Completed", "Won't do"], default: "To Do" },
  completion: { type: Number, default: 0 },
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);