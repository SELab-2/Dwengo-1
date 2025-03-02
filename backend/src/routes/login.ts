import express from 'express';
const router = express.Router();

// Returns login paths for IDP
router.get('/', (req, res) => {
    res.json({
        // Dummy variables, needs to be changed
        // With IDP endpoints
        leerkracht: '/login-leerkracht',
        leerling: '/login-leerling',
    });
});

export default router;
