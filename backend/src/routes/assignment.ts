/**
 * @swagger
 * components:
 *   parameters:
 *     id:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *       description: The id of the assignment
 *       required: true
 *       example: 0
 */

import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /assignment:
 *   get:
 *     summary: Get a list of assignments
 *     tags: [Assignment]
 *     parameters:
 *     responses:
 *       200:
 *         description: A list of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: '0'
 *                     description: The id of the assignment
 */
router.get('/', (req, res) => {
    res.json({
        assignments: ['0', '1'],
    });
});

/**
 * @swagger
 * /assignment/{id}:
 *   get:
 *     summary: Get an assignment by id
 *     tags: [Assignment]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: An assignment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 */
// Information about an assignment with id 'id'
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        title: 'Dit is een test assignment',
        description: 'Een korte beschrijving',
        groups: ['0'],
        learningPath: '0',
        class: '0',
        links: {
            self: `${req.baseUrl}/${req.params.id}`,
            submissions: `${req.baseUrl}/${req.params.id}`,
        },
    });
});

/**
 * @swagger
 * /assignment/{id}/submissions:
 *   get:
 *     summary: Get a list of submissions for an assignment
 *     tags: [Assignment]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: A list of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: '0'
 */
router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: ['0'],
    });
});

/**
 * @swagger
 * /assignment/{id}/groups:
 *   get:
 *     summary: Get a list of groups for an assignment
 *     tags: [Assignment]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: A list of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: '0'
 */
router.get('/:id/groups', (req, res) => {
    res.json({
        groups: ['0'],
    });
});

/**
 * @swagger
 * /assignment/{id}/questions:
 *   get:
 *     summary: Get a list of questions for an assignment
 *     tags: [Assignment]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: '0'
 */
router.get('/:id/questions', (req, res) => {
    res.json({
        questions: ['0'],
    });
});

export default router;
