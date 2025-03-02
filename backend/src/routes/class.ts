import express from 'express'
const router = express.Router();

// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        classes: [
            '0',
            '1',
        ]
    });
});

// Information about an class with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        displayName: 'Klas 4B',
        teachers: [ '0' ],
        students: [ '0' ],
        joinRequests: [ '0' ],
        links: {
            self: `${req.baseUrl}/${req.params.id}`,
            classes: `${req.baseUrl}/${req.params.id}/invitations`,
            questions: `${req.baseUrl}/${req.params.id}/assignments`,
            students: `${req.baseUrl}/${req.params.id}/students`,
        }
    });
})

router.get('/:id/invitations', (req, res) => {
    res.json({
        invitations: [ 
            '0'
        ],
    });
})

router.get('/:id/assignments', (req, res) => {
    res.json({
        assignments: [ 
            '0'
        ],
    });
})

router.get('/:id/students', (req, res) => {
    res.json({
        students: [ 
            '0'
        ],
    });
})

export default router