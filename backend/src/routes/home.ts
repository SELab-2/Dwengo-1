import express from 'express';
import { getHomeScreenData } from '../controllers/home.js';

const router = express.Router();

/**
 * @route GET /api/home
 * @query {string} language - Taalcode (bijv. 'nl' of 'fr')
 * @returns JSON object with homepage data (strengths)
 * @example http://localhost:3000/home
 * {title, description, strengths: {title, image}}
 */
router.get('/', getHomeScreenData);

export default router;
