import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: '0.1.0',
        title: 'Dwengo-1 Backend API',
        description: 'Dwengo-1 Backend API using Express, based on VZW Dwengo',
        license: {
            name: 'MIT',
            url: 'https://github.com/SELab-2/Dwengo-1/blob/336496ab6352ee3f8bf47490c90b5cf81526cef6/LICENSE',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Development server',
        },
        {
            url: 'http://localhost/',
            description: 'Staging server',
        },
        {
            url: 'https://sel2-1.ugent.be/',
            description: 'Production server',
        },
    ],
    components: {
        securitySchemes: {
            studentDev: {
                type: 'oauth2',
                flows: {
                    implicit: {
                        authorizationUrl: 'http://localhost:7080/realms/student/protocol/openid-connect/auth',
                        scopes: {
                            openid: 'openid',
                            profile: 'profile',
                            email: 'email',
                        },
                    },
                },
            },
            teacherDev: {
                type: 'oauth2',
                flows: {
                    implicit: {
                        authorizationUrl: 'http://localhost:7080/realms/teacher/protocol/openid-connect/auth',
                        scopes: {
                            openid: 'openid',
                            profile: 'profile',
                            email: 'email',
                        },
                    },
                },
            },
            studentStaging: {
                type: 'oauth2',
                flows: {
                    implicit: {
                        authorizationUrl: 'http://localhost/idp/realms/student/protocol/openid-connect/auth',
                        scopes: {
                            openid: 'openid',
                            profile: 'profile',
                            email: 'email',
                        },
                    },
                },
            },
            teacherStaging: {
                type: 'oauth2',
                flows: {
                    implicit: {
                        authorizationUrl: 'http://localhost/idp/realms/teacher/protocol/openid-connect/auth',
                        scopes: {
                            openid: 'openid',
                            profile: 'profile',
                            email: 'email',
                        },
                    },
                },
            },
            studentProduction: {
                type: 'oauth2',
                flows: {
                    implicit: {
                        authorizationUrl: 'https://sel2-1.ugent.be/idp/realms/student/protocol/openid-connect/auth',
                        scopes: {
                            openid: 'openid',
                            profile: 'profile',
                            email: 'email',
                        },
                    },
                },
            },
            teacherProduction: {
                type: 'oauth2',
                flows: {
                    implicit: {
                        authorizationUrl: 'https://sel2-1.ugent.be/idp/realms/teacher/protocol/openid-connect/auth',
                        scopes: {
                            openid: 'openid',
                            profile: 'profile',
                            email: 'email',
                        },
                    },
                },
            },
        },
    },
};

const outputFile = './swagger.json';
const routes = ['../../backend/src/app.ts'];

void swaggerAutogen({ openapi: '3.1.0' })(outputFile, routes, doc);
