import express from 'express'
const router = express.Router();

// returns login paths for IDP
router.get('/', (req, res) => {
    res.send('login route');
})

export default router