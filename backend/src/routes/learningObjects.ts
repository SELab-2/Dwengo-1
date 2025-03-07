/**
 * @swagger
 * tags:
 *   name: LearningObject
 *   description: API for managing learning objects
 */

import express from 'express';
import {
    getAllLearningObjects,
    getLearningObject,
} from '../controllers/learningObjects.js';

const router = express.Router();

// DWENGO learning objects

/**
 * @swagger
 * /learningObject:
 *   get:
 *     summary: Get a list of learning objects
 *     tags: [LearningObject]
 *     parameters:
 *       - in: query
 *         name: hruid
 *         schema:
 *           type: string
 *         description:
 *           The hruid of the learning path to get learning objects from
 *         example: un_artificiele_intelligentie
 *       - in: query
 *         name: full
 *         description: Whether to return full object data
 *       - $ref: '#/components/parameters/Language'
 *     responses:
 *       200:
 *         description: A list of learning objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LearningObject'
 *       400:
 *         description: HRUID query is required
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllLearningObjects);

/**
 * @swagger
 * /learningObject/{hruid}:
 *   get:
 *     summary: Get a learning object by hruid
 *     tags: [LearningObject]
 *     parameters:
 *       - in: path
 *         name: hruid
 *         schema:
 *           type: string
 *         required: true
 *         description: The hruid of the learning object
 *         example: un_ai7
 *       - $ref: '#/components/parameters/Language'
 *     responses:
 *       200:
 *         description: A learning object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LearningObject"
 *       400:
 *         description: HRUID parameter is required
 *       500:
 *         description: Internal server error
 */
router.get('/:hruid', getLearningObject);

export default router;
