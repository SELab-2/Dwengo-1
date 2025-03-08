import express from 'express'
import { getGroupHandler } from '../controllers/groups';
const router = express.Router({ mergeParams: true });

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
router.get('/:groupid', getGroupHandler);

// the list of questions a group has made
router.get('/:id/question', (req, res) => {
    res.json({
        questions: [ '0' ],
    });
})

export default router