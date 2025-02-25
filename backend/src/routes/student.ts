import express from 'express'
const router = express.Router();

// the list of classes a student is in
router.get('/:id/classes', (req, res) => {
    res.json({
        classes: [ '0' ],
    });
})

// the list of submissions a student has made
router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: [ '0' ],
    });
})

  
// the list of assignments a student has
router.get('/:id/assignments', (req, res) => {
    res.json({
        assignments: [ '0' ],
    });
})
  
// the list of groups a student is in
router.get('/:id/groups', (req, res) => {
    res.json({
        groups: [ '0' ],
    });
})

export default router