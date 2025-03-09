import express from 'express';
const router = express.Router();

// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        questions: ['0', '1'],
    });
});

// Information about an question with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        student: '0',
        group: '0',
        time: new Date(2025, 1, 1),
        content:
            'Zijn alle gehele getallen groter dan 2 gelijk aan de som van 2 priemgetallen????',
        learningObject: '0',
        links: {
            self: `${req.baseUrl}/${req.params.id}`,
            answers: `${req.baseUrl}/${req.params.id}/answers`,
        },
    });
});

router.get('/:id/answers', (req, res) => {
    res.json({
        answers: ['0'],
    });
});

export default router;
