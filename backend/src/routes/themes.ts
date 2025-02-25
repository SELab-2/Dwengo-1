import express from 'express'
const router = express.Router();

// I'm not sure what's supposed to be here 
// https://github.com/SELab-2/Dwengo-1/issues/24
router.get('/', (req, res) => {
    res.send('themes route');
})

export default router