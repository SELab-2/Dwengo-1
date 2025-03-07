/**
 * @swagger
 * components:
 *   parameters:
 *     id:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *       description: The id of the class
 *       required: true
 *       example: 0
 */

import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /class:
 *   get:
 *     summary: Get a list of classes
 *     tags: [Class]
 *     responses:
 *       200:
 *         description: A list of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classes:
 *                  type: array
 *                  items:
 *                    type: string
 *                    example: '0'
 */
router.get('/', (req, res) => {
    res.json({
        classes: ['0', '1'],
    });
});

// Information about an class with id 'id'
/**
 * @swagger
 * /class/{id}:
 *   get:
 *     summary: Get a class by id
 *     tags: [Class]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: A class
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 */
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        displayName: 'Klas 4B',
        teachers: ['0'],
        students: ['0'],
        joinRequests: ['0'],
        links: {
            self: `${req.baseUrl}/${req.params.id}`,
            classes: `${req.baseUrl}/${req.params.id}/invitations`,
            questions: `${req.baseUrl}/${req.params.id}/assignments`,
            students: `${req.baseUrl}/${req.params.id}/students`,
        },
    });
});

router.get('/:id/invitations', (req, res) => {
    res.json({
        invitations: ['0'],
    });
});

router.get('/:id/assignments', (req, res) => {
    res.json({
        assignments: ['0'],
    });
});

router.get('/:id/students', (req, res) => {
    res.json({
        students: ['0'],
    });
});

export default router;
