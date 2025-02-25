import express from 'express'
const router = express.Router();

// information about a group (members, ... [TODO DOC])
router.get('/:id', (req, res) => {
    res.send('group');
})

// the list of questions a group has made
router.get('/:id/question', (req, res) => {
    res.send('questions');
})

export default router