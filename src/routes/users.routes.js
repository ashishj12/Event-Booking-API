import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createUserSchema, getUserBookingsSchema } from '../validations/user.validation.js';
import * as userCtrl from '../controllers/userController.js';

const router = Router();

router.post('/',
  validate(createUserSchema),
  userCtrl.createUser
);

router.get('/:id/bookings',
  validate(getUserBookingsSchema),
  userCtrl.getUserBookings
);

export default router;