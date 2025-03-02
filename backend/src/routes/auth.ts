import express from 'express'
import {getFrontendAuthConfig} from "../controllers/auth";
const router = express.Router();

// returns auth configuration for frontend
router.get('/config', (req, res) => {
    res.json(getFrontendAuthConfig());
});

export default router;
