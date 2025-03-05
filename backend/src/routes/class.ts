import express from 'express'
import { getAllClassesHandler, getClassHandler, getClassStudentsHandler } from '../controllers/classes';
const router = express.Router();

// root endpoint used to search objects
router.get('/', getAllClassesHandler);

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

router.get('/:id/students', getClassStudentsHandler);

export default router