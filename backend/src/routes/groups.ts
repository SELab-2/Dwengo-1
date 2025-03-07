import express from 'express'
const router = express.Router();

// root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        groups: [
            '0',
            '1',
        ]
    });
});

// information about a group (members, ... [TODO DOC])
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        assignment: '0',
        students: [ '0' ],
        submissions: [ '0' ],
        // reference to other endpoint
        // should be less hardcoded
        questions: `/group/${req.params.id}/question`, 
    });
})

// the list of questions a group has made
router.get('/:id/question', (req, res) => {
    res.json({
        questions: [ '0' ],
    });
})

export default router