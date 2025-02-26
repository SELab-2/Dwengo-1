import express from 'express';
import { getThemes, getThemeByTitle } from '../controllers/themes.js';

const router = express.Router();

router.get('/', getThemes);
router.get('/:theme', getThemeByTitle);

export default router;
