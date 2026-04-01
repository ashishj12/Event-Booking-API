import { Router } from 'express';
import eventRoutes from './events.routes.js';
import bookingRoutes from './bookings.routes.js';
import userRoutes from './users.routes.js';

const router = Router();

router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);

export default router;
