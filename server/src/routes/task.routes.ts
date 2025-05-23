import express from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

const router = express.Router();

router.post("/", createTask);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;
