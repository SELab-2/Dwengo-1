import { Response, Router } from 'express';
import studentRouter from './student.js';
import groupRouter from './group.js';
import assignmentRouter from './assignment.js';
import submissionRouter from './submission.js';
import classRouter from './class.js';
import questionRouter from './question.js';
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
router.use('/group', groupRouter /* #swagger.tags = ['Group'] */);
router.use('/assignment', assignmentRouter /* #swagger.tags = ['Assignment'] */);
router.use('/submission', submissionRouter /* #swagger.tags = ['Submission'] */);
router.use('/class', classRouter /* #swagger.tags = ['Class'] */);
router.use('/question', questionRouter /* #swagger.tags = ['Question'] */);
router.use('/auth', authRouter /* #swagger.tags = ['Auth'] */);
router.use('/theme', themeRoutes /* #swagger.tags = ['Theme'] */);
router.use('/learningPath', learningPathRoutes /* #swagger.tags = ['Learning Path'] */);
router.use('/learningObject', learningObjectRoutes /* #swagger.tags = ['Learning Object'] */);

export default router;
