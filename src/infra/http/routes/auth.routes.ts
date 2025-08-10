import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthAdapter } from '@infra/http/adapters/auth.adapter';

const router = Router();
const authAdapter = container.resolve(AuthAdapter);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: Realiza login do usuário e retorna token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 *       400:
 *         description: Dados de entrada inválidos
 */
router.post('/login', (req, res, next) => authAdapter.login(req, res, next));

export { router as authRoutes }; 