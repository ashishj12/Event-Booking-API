import { Router } from 'express';
import eventRoutes   from './events.js';
import bookingRoutes from './bookings.js';
import userRoutes    from './users.js';

const router = Router();

router.use('/events',   eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users',    userRoutes);

export default router;