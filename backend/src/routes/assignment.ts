import express from 'express'
const router = express.Router();

// information about an assignment with id 'id'
router.get('/:id', (req, res) => {
    res.send('assignment');
})

export default router