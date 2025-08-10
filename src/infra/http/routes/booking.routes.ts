import { Router } from 'express';
import { container } from 'tsyringe';
import { BookingAdapter } from '../adapters/booking.adapter';
import { authMiddleware } from '../middlewares/auth.middleware';

const bookingAdapter = container.resolve(BookingAdapter);
const router = Router();

router.post('/', authMiddleware, (req, res, next) => bookingAdapter.create(req, res, next));
router.get('/', authMiddleware, (req, res, next) => bookingAdapter.list(req, res, next));
router.get('/mine', authMiddleware, (req, res, next) => bookingAdapter.listByUser(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => bookingAdapter.cancel(req, res, next));
router.delete('/admin/:id', authMiddleware, (req, res, next) => bookingAdapter.adminCancel(req, res, next));

export default router; 