import express from 'express'
const router = express.Router();

// information about an question with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        student: '0',
        group: '0',
        time: new Date(2025, 1, 1),
        content: 'Zijn alle gehele getallen groter dan 2 gelijk aan de som van 2 priemgetallen????',
        answers: [ '0' ],
        learningObject: [ '0' ],
    });
})

export default router