import express from "express";
import {
    createBoard,
    deleteBoard,
    getBoardById,
    updateBoard
} from "../controllers/board.controller";

const router = express.Router();

router.post("/", createBoard);
router.get("/:boardId", getBoardById);
router.put("/:boardId", updateBoard);
router.delete("/:boardId", deleteBoard);

export default router;
