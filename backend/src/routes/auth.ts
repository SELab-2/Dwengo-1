import express from 'express';
import { handleGetFrontendAuthConfig, postHelloHandler } from '../controllers/auth.js';
import { authenticatedOnly, studentsOnly, teachersOnly } from '../middleware/auth/checks/auth-checks.js';

const router = express.Router();

// Returns auth configuration for frontend
router.get('/config', handleGetFrontendAuthConfig);

router.get('/testAuthenticatedOnly', authenticatedOnly, (_req, res) => {
    /* #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }] */
    res.json({ message: 'If you see this, you should be authenticated!' });
});

router.get('/testStudentsOnly', studentsOnly, (_req, res) => {
    /* #swagger.security = [{ "studentProduction": [ ] }, { "studentStaging": [ ] }, { "studentDev": [ ] }] */
    res.json({ message: 'If you see this, you should be a student!' });
});

router.get('/testTeachersOnly', teachersOnly, (_req, res) => {
    /* #swagger.security = [{ { "teacherProduction": [ ] }, { "teacherStaging": [ ] }, { "teacherDev": [ ] }] */
    res.json({ message: 'If you see this, you should be a teacher!' });
});

// This endpoint is called by the client when the user has just logged in.
// It creates or updates the user entity based on the authentication data the endpoint was called with.
router.post(
    '/hello',
    authenticatedOnly,
    /*
    #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }]
*/ postHelloHandler
);

export default router;
