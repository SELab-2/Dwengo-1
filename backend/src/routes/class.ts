import express from 'express'
import { getClassHandler } from '../controllers/classes';
const router = express.Router();

// root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        classes: [
            '0',
            '1',
        ]
    });
});

// information about an class with id 'id'
router.get('/:id', getClassHandler);

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