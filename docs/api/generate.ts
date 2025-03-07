import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: '0.1.0',
        title: 'Dwengo-1 Backend API',
        description: 'Dwengo-1 Backend API using Express, based on VZW Dwengo',
        license: {
            name: 'MIT',
            url: 'https://github.com/SELab-2/Dwengo-1/blob/336496ab6352ee3f8bf47490c90b5cf81526cef6/LICENSE'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000/',
        },
        {
            url: 'https://sel2-1.ugent.be/api'
        }
    ]
};

const outputFile = './swagger.json';
const routes = [
    '../../backend/src/app.ts'
];

swaggerAutogen({ openapi: '3.1.0' })(outputFile, routes, doc);
