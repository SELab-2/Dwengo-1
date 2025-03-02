import express from 'express';
const router = express.Router();

// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        assignments: ['0', '1'],
    });
});

// Information about an assignment with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        title: 'Dit is een test assignment',
        description: 'Een korte beschrijving',
        groups: ['0'],
        learningPath: '0',
        class: '0',
        links: {
            self: `${req.baseUrl}/${req.params.id}`,
            submissions: `${req.baseUrl}/${req.params.id}`,
        },
    });
});

router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: ['0'],
    });
});

router.get('/:id/groups', (req, res) => {
    res.json({
        groups: ['0'],
    });
});

router.get('/:id/questions', (req, res) => {
    res.json({
        questions: ['0'],
    });
});

export default router;
