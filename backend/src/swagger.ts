import swaggerJSDoc from 'swagger-jsdoc';
import { RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerJSDocOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Dwengo-1 Backend API',
            version: '0.1.0',
            description: 'Dwengo-1 Backend API Using Express, based on VZW Dwengo',
            license: {
                'name': 'MIT',
                'url': 'https://github.com/SELab-2/Dwengo-1/blob/336496ab6352ee3f8bf47490c90b5cf81526cef6/LICENSE'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
            {
                url: 'https://sel2-1.ugent.be/api'
            }
        ]
    },
    apis: [ './src/routes/*.ts', './src/entities/**/*.ts' ]
};

const swaggerOptions = {
    explorer: true
};
const swaggerDocument = swaggerJSDoc(swaggerJSDocOptions);

const swaggerMiddleware: RequestHandler = swaggerUi.setup(swaggerDocument, swaggerOptions);

export default swaggerMiddleware;
