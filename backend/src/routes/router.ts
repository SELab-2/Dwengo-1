import { Response, Router } from 'express';
import studentRouter from './students.js';
import teacherRouter from './teachers.js';
import classRouter from './classes.js';
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

router.use('/auth', authRouter /* #swagger.tags = ['Auth'] */);
router.use(
    '/class',
    classRouter /* #swagger.tags = ['Class'], #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }] */
);
router.use(
    '/learningObject',
    learningObjectRoutes /* #swagger.tags = ['Learning Object'], #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }] */
);
router.use(
    '/learningPath',
    learningPathRoutes /* #swagger.tags = ['Learning Path'], #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }] */
);
router.use(
    '/student',
    studentRouter /* #swagger.tags = ['Student'], #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }] */
);
router.use(
    '/teacher',
    teacherRouter /* #swagger.tags = ['Teacher'], #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }] */
);
router.use(
    '/theme',
    themeRoutes /* #swagger.tags = ['Theme'], #swagger.security = [{ "studentProduction": [ ] }, { "teacherProduction": [ ] }, { "studentStaging": [ ] }, { "teacherStaging": [ ] }, { "studentDev": [ ] }, { "teacherDev": [ ] }] */
);

export default router;
