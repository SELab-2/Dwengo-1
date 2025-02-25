import express from 'express'
const router = express.Router();

// information about an submission with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        student: '0',
        group: '0',
        time: new Date(2025, 1, 1),
        content: 'Wortel 2 is rationeel',
        learningObject: '0',
    });
})

export default router