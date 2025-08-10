import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'Woba test',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/docs/schemas.ts',
    './src/infra/http/routes/*.ts',
    './src/infra/http/adapters/*.ts',
    './src/infra/http/dtos/**/*.ts'
  ],
};

const swaggerSpec = swaggerJsDoc(options);
export { swaggerUi, swaggerSpec };
