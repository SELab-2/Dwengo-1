import { Response, Router } from 'express';
import studentRouter from './students.js';
import groupRouter from './groups.js';
import assignmentRouter from './assignments.js';
import submissionRouter from './submissions.js';
import classRouter from './classes.js';
import questionRouter from './questions.js';
import authRouter from './auth.js';
import themeRoutes from './themes.js';
import learningPathRoutes from './learning-paths.js';
import learningObjectRoutes from './learning-objects.js';
import { getLogger, Logger } from '../logging/initalize.js';

const router = Router();
const logger: Logger = getLogger();

router.get('/', (_, res: Response) => {
    logger.debug('GET /');
    res.json({
        message: 'Hello Dwengo!🚀',
    });
});

router.use('/student', studentRouter /* #swagger.tags = ['Student'] */);
router.use('/class', classRouter /* #swagger.tags = ['Class'] */);
router.use('/auth', authRouter /* #swagger.tags = ['Auth'] */);
router.use('/theme', themeRoutes /* #swagger.tags = ['Theme'] */);
router.use('/learningPath', learningPathRoutes /* #swagger.tags = ['Learning Path'] */);
router.use('/learningObject', learningObjectRoutes /* #swagger.tags = ['Learning Object'] */);

export default router;
