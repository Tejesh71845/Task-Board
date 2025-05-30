import express from "express";
import { getTaskSuggestions } from "../controllers/ai.controller";

const router = express.Router();
router.post("/suggest", getTaskSuggestions);
export default router;
