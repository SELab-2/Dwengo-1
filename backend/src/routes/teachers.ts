import express from 'express'
const router = express.Router();

// root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        teachers: [
            '0',
            '1',
        ]
    });
});

// information about a teacher
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        firstName: 'John',
        lastName: 'Doe',
        username: 'JohnDoe1',
        links: {
            self: `${req.baseUrl}/${req.params.id}`,
            classes: `${req.baseUrl}/${req.params.id}/classes`,
            questions: `${req.baseUrl}/${req.params.id}/questions`,
            invitations: `${req.baseUrl}/${req.params.id}/invitations`,
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