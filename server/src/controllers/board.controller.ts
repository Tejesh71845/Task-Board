// board.controller.ts
import { Request, Response } from "express";
import { Board } from "../models/board.model";
import { Task } from "../models/task.model";

// Create
export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Prevent duplicate board names
    const existingBoard = await Board.findOne({ name });
    if (existingBoard) {
      res.status(400).json({ message: "Board with this name already exists." });
      return;
    }

    const board = new Board({ name, description });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to create board", error });
  }
};


// GET /api/boards
export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch boards", error });
  }
};



// Get
export const getBoardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const tasks = await Task.find({ boardId: board._id });
    res.json({ board, tasks });
  } catch (error) {
    res.status(500).json({ message: "Failed to get board", error });
  }
};

// Update
export const updateBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.boardId,
      req.body,
      { new: true }
    );

    if (!updatedBoard) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: "Failed to update board", error });
  }
};

// Delete
export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await Board.findByIdAndDelete(req.params.boardId);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    await Task.deleteMany({ boardId: board._id });
    res.json({ message: "Board and its tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete board", error });
  }
};
