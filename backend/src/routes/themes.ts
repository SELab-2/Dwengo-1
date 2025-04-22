import express from 'express';
import { getThemesHandler, getHruidsByThemeHandler } from '../controllers/themes.js';
import { authenticatedOnly } from '../middleware/auth/checks/auth-checks';

const router = express.Router();

// Query: language
//  Route to fetch list of {key, title, description, image} themes in their respective language
router.get('/', authenticatedOnly, getThemesHandler);

// Arg: theme (key)
//  Route to fetch list of hruids based on theme
router.get('/:theme', authenticatedOnly, getHruidsByThemeHandler);

export default router;
