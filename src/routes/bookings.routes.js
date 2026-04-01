import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createBookingSchema } from '../utils/validation.js';
import * as bookingCtrl from '../controllers/booking.controller.js';

const router = Router();

router.post('/', validate(createBookingSchema), bookingCtrl.book);

export default router;