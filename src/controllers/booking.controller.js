import * as bookingService from '../services/bookingService.js';

export const book = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    const result = await bookingService.createBooking({ userId, eventId });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err); // passes to global error handler
  }
};