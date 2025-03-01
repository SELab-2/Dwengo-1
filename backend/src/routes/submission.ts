import express from 'express'
const router = express.Router();

// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        submissions: [
            '0',
            '1',
        ]
    });
});

// Information about an submission with id 'id'
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