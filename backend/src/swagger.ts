import { RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../docs/api/swagger.json' with { type: 'json' };

const swaggerMiddleware: RequestHandler = swaggerUi.setup(swaggerDocument);

export default swaggerMiddleware;
