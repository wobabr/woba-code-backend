import { Router } from 'express';
import { userRoutes } from './user.routes';
import { authRoutes } from './auth.routes';
import meetingRoomRoutes from './meeting-room.routes';
import bookingRoutes from './booking.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/meeting-rooms', meetingRoomRoutes);
router.use('/bookings', bookingRoutes);

export { router };
