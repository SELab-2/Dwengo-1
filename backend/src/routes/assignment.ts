import express from 'express'
const router = express.Router();

// information about an assignment with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        title: 'Dit is een test assignment',
        description: 'Een korte beschrijving',
        groups: [ '0' ],
        learningPath: '0',
        class: '0'
    });
})

export default router