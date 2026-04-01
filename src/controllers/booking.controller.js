import * as bookingService from '../services/booking.service.js';

export const book = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    const result = await bookingService.createBooking({ userId, eventId });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
