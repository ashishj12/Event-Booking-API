import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createEventSchema, attendanceSchema } from '../validations/event.validation.js';
import * as eventCtrl from '../controllers/eventController.js';

const router = Router();

router.get('/', eventCtrl.listEvents);

router.post('/',
  validate(createEventSchema),
  eventCtrl.createEvent
);

router.post('/:id/attendance',
  validate(attendanceSchema),
  eventCtrl.recordAttendance
);

export default router;