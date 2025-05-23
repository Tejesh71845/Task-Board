import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  name: string;
  description: string;
  icon: string;
  status: "In Progress" | "Completed" | "Won't do" | "To Do";
  boardId: mongoose.Types.ObjectId;
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
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
