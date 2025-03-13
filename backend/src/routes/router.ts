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

router.use('/student', studentRouter);
router.use('/group', groupRouter);
router.use('/assignment', assignmentRouter);
router.use('/submission', submissionRouter);
router.use('/class', classRouter);
router.use('/question', questionRouter);
router.use('/auth', authRouter);
router.use('/theme', themeRoutes);
router.use('/learningPath', learningPathRoutes);
router.use('/learningObject', learningObjectRoutes);

export default router;
