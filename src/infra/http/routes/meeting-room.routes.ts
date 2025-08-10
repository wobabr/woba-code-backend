import { Router } from 'express';
import { container } from 'tsyringe';
import { MeetingRoomAdapter } from '../adapters/meeting-room.adapter';
import { authMiddleware } from '../middlewares/auth.middleware';

const meetingRoomAdapter = container.resolve(MeetingRoomAdapter);
const router = Router();

router.post('/', authMiddleware, (req, res, next) => meetingRoomAdapter.create(req, res, next));
router.get('/', authMiddleware, (req, res, next) => meetingRoomAdapter.list(req, res, next));
router.get('/mine', authMiddleware, (req, res, next) => meetingRoomAdapter.listMine(req, res, next));
router.get('/list', (req, res, next) => meetingRoomAdapter.publicList(req, res, next));
router.get('/:id/bookings', authMiddleware, (req, res, next) => meetingRoomAdapter.listBookings(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => meetingRoomAdapter.delete(req, res, next));

export default router; 