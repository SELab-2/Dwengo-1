import express from 'express';
const router = express.Router();

// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        students: ['0', '1'],
    });
});

// Information about a student's profile
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        firstName: 'Jimmy',
        lastName: 'Faster',
        username: 'JimmyFaster2',
        endpoints: {
            classes: `/student/${req.params.id}/classes`,
            questions: `/student/${req.params.id}/submissions`,
            invitations: `/student/${req.params.id}/assignments`,
            groups: `/student/${req.params.id}/groups`,
        },
    });
});

// The list of classes a student is in
router.get('/:id/classes', (req, res) => {
    res.json({
        classes: ['0'],
    });
});

// The list of submissions a student has made
router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: ['0'],
    });
});

// The list of assignments a student has
router.get('/:id/assignments', (req, res) => {
    res.json({
        assignments: ['0'],
    });
});

// The list of groups a student is in
router.get('/:id/groups', (req, res) => {
    res.json({
        groups: ['0'],
    });
});

export default router;
