import express from 'express'
const router = express.Router();

// information about a teacher
router.get('/:id/', (req, res) => {
    res.json({
        id: req.params.id,
        firstName: 'John',
        lastName: 'Doe',
        username: 'JohnDoe1',
        endpoints: {
            classes: `/teacher/${req.params.id}/classes`,
            questions: `/teacher/${req.params.id}/questions`,
            invitations: `/teacher/${req.params.id}/invitations`,
        },
    });
})

// the questions students asked a teacher
router.get('/:id/questions', (req, res) => {
    res.json({
        questions: [
            '0'
        ],
    });
});

// invitations to other classes a teacher received
router.get('/:id/invitations', (req, res) => {
    res.json({
        invitations: [
            '0'
        ],
    });
});

// a list with ids of classes a teacher is in
router.get('/:id/classes', (req, res) => {
    res.json({
        classes: [
            '0'
        ],
    });
});


export default router