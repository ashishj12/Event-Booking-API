import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createUserSchema, getUserBookingsSchema } from '../utils/validation.js';
import * as userCtrl from '../controllers/user.controller.js';

const router = Router();

router.post('/', validate(createUserSchema), userCtrl.createUser);

router.get('/:id/bookings', validate(getUserBookingsSchema), userCtrl.getUserBookings);

export default router;