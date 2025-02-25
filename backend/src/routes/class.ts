import express from 'express'
const router = express.Router();

// information about an class with id 'id'
router.get('/:id', (req, res) => {
    res.send('class');
})

export default router