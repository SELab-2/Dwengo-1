import { Response, Router } from 'express';
import studentRouter from './student';
import groupRouter from './group';
import assignmentRouter from './assignment';
import submissionRouter from './submission';
import classRouter from './class';
import questionRouter from './question';
import authRouter from './auth';
import themeRoutes from './themes';
import learningPathRoutes from './learning-paths';
import learningObjectRoutes from './learning-objects';
import { getLogger, Logger } from '../logging/initalize';

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
