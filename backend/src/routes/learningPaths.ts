import express from "express";
import { getLearningPathsFromIds, getLearningPathsByTheme, getAllLearningPaths, searchLearningPaths } from "../controllers/learningPaths.js";

const router = express.Router();

// query: language
// Route to fetch learning paths based on a list of HRUIDs
router.get("/", getLearningPathsFromIds);

// query: language
// Route to fetch all possible learning paths
router.get("/all", getAllLearningPaths);

// query: language
// Route to fetch learning paths based on a searchterm
router.get("/search", searchLearningPaths);

// arg: theme id
// query: language
// Route to fetch learning paths based on a theme
router.get("/theme/:theme", getLearningPathsByTheme);

export default router;
