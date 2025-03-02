import express from 'express'
import {getFrontendAuthConfig} from "../controllers/auth";
import {authenticatedOnly, studentsOnly, teachersOnly} from "../middleware/auth/auth";
const router = express.Router();

// returns auth configuration for frontend
router.get('/config', (req, res) => {
    res.json(getFrontendAuthConfig());
});

router.get('/testAuthenticatedOnly', authenticatedOnly, (req, res) => {
    res.json({message: "If you see this, you should be authenticated!"});
});

router.get('/testStudentsOnly', studentsOnly, (req, res) => {
    res.json({message: "If you see this, you should be a student!"});
});

router.get('/testTeachersOnly', teachersOnly, (req, res) => {
    res.json({message: "If you see this, you should be a teacher!"});
});

export default router;
