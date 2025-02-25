import express from 'express'
const router = express.Router();

// information about an class with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        displayName: 'Klas 4B',
        teachers: [ '0' ],
        students: [ '0' ],
        assignments: [ '0' ],
        joinRequests: [ '0' ],
        invitations: [ '0' ],
    });
})

export default router