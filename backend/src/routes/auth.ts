import express from 'express';
import { getFrontendAuthConfig } from '../controllers/auth.js';
import { authenticatedOnly, studentsOnly, teachersOnly } from '../middleware/auth/auth.js';
const router = express.Router();

// Returns auth configuration for frontend
router.get('/config', (req, res) => {
    res.json(getFrontendAuthConfig());
});

router.get('/testAuthenticatedOnly', authenticatedOnly, (req, res) => {
    /* #swagger.security = [{ "student": [ ] }, { "teacher": [ ] }] */
    res.json({ message: 'If you see this, you should be authenticated!' });
});

router.get('/testStudentsOnly', studentsOnly, (req, res) => {
    /* #swagger.security = [{ "student": [ ] }] */
    res.json({ message: 'If you see this, you should be a student!' });
});

router.get('/testTeachersOnly', teachersOnly, (req, res) => {
    /* #swagger.security = [{ "teacher": [ ] }] */
    res.json({ message: 'If you see this, you should be a teacher!' });
});

export default router;
