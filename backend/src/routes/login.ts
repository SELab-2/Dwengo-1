import express from 'express'
const router = express.Router();

// returns login paths for IDP
router.get('/', (req, res) => {
    res.json({
        // dummy variables, needs to be changed
        // with IDP endpoints
        leerkracht: '/login-leerkracht',
        leerling: '/login-leerling',
    });
})

export default router