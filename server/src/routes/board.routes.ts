import express from "express";
import {
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,        // 👈 import the controller
  updateBoard,
} from "../controllers/board.controller";

const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);            // 👈 Add this route
router.get("/:boardId", getBoardById);
router.put("/:boardId", updateBoard);
router.delete("/:boardId", deleteBoard);

export default router;
