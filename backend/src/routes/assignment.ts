import express from 'express'
import { getAssignmentHandler } from '../controllers/assignments';
import groupRouter from './group.js';

const router = express.Router({ mergeParams: true });

// root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        assignments: [
            '0',
            '1',
        ]
    });
});

// information about an assignment with id 'id'
router.get('/:id', getAssignmentHandler);

router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: [
            '0'
        ],
    });
});

router.get('/:id/questions', (req, res) => {
    res.json({
        questions: [
            '0'
        ],
    });
});

router.use('/:assignmentid/groups', groupRouter);

export default router