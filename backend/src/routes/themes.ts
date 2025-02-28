import express from 'express';
import { getThemes, getThemeByTitle } from '../controllers/themes.js';

const router = express.Router();

// Query: language
//  Route to fetch list of {key, title, description, image} themes in their respective language
router.get('/', getThemes);

// Arg: theme (key)
//  Route to fetch list of hruids based on theme
router.get('/:theme', getThemeByTitle);

export default router;
