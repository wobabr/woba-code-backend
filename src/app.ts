import express from 'express';
import { swaggerUi, swaggerSpec } from '@docs/swagger';
import { errorHandlerMiddleware } from '@infra/http/middlewares/error-handler.middleware';
import { requestLoggerMiddleware } from '@infra/http/middlewares/request-logger.middleware';
import { errorLoggerMiddleware } from '@infra/http/middlewares/error-logger.middleware';
import './shared/container/dependency-injection';
import { router } from '@routes/index';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLoggerMiddleware);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(router);

app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);

export default app;
