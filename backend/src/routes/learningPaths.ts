import express from "express";
import { getLearningPathsFromIds, getLearningPathsByTheme, getAllLearningPaths, searchLearningPaths } from "../controllers/learningPaths.js";

const router = express.Router();

// Route to fetch learning paths based on a list of HRUIDs
router.get("/", getLearningPathsFromIds);

// Route to fetch all possible learning paths
router.get("/all", getAllLearningPaths);

// Route to fetch learning paths based on a searchterm
router.get("/search", searchLearningPaths);

// Route to fetch learning paths based on a theme
router.get("/theme/:theme", getLearningPathsByTheme);

export default router;
