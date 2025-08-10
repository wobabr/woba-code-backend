import { Router } from 'express';
import { container } from 'tsyringe';
import { UserAdapter } from '@infra/http/adapters/user.adapter';

const router = Router();
const userAdapter = container.resolve(UserAdapter);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados de entrada inválidos
 *       409:
 *         description: Usuário já existe
 */
router.post('/register', (req, res, next) => userAdapter.register(req, res, next));

export { router as userRoutes }; 