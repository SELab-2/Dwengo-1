import express from 'express'
const router = express.Router();

// the list of classes a student is in
router.get('/:id/classes', (req, res) => {
    res.send('classes');
})

// the list of submissions a student has made
router.get('/:id/submissions', (req, res) => {
    res.send('submissions');
})

  
// the list of assignments a student has
router.get('/:id/assignments', (req, res) => {
    res.send('assignments');
})
  
// the list of groups a student is in
router.get('/:id/group', (req, res) => {
    res.send('groups');
})

export default router