import express from 'express'
const router = express.Router();

// information about an question with id 'id'
router.get('/:id', (req, res) => {
    res.send('question');
})

export default router