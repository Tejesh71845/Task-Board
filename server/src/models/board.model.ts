import mongoose, { Document, Schema } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description: string;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: { type: String, default: "My Task Board" },
    description: { type: String, default: "Tasks to keep organised" },
  },
  { timestamps: true }
);

export const Board = mongoose.model<IBoard>("Board", BoardSchema);
