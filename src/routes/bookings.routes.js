import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createBookingSchema } from '../validations/booking.validation.js';
import * as bookingCtrl from '../controllers/bookingController.js';

const router = Router();

router.post('/',
  validate(createBookingSchema),
  bookingCtrl.book
);

export default router;