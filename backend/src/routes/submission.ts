import express from 'express'
const router = express.Router();

// information about an submission with id 'id'
router.get('/:id', (req, res) => {
    res.send('submission');
})

export default router