import express from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleSubtaskStatus,
} from "../controllers/task.controller";

const router = express.Router();

router.post("/", createTask);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId/toggle-subtask/:subtaskId", toggleSubtaskStatus);


export default router;
