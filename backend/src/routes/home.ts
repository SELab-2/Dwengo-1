import express from 'express';
import { getHomeScreenData } from '../controllers/home.js';

const router = express.Router();

/**
 * @route GET /api/home
 * @query {string} language - Taalcode (bijv. 'nl' of 'fr')
 * @returns JSON object with homepage data (strengths)
 */
router.get('/', getHomeScreenData);

export default router;
