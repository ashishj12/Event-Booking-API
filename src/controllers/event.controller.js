import * as eventService from '../services/event.service.js';

export const listEvents = async (req, res, next) => {
  try {
    const events = await eventService.getUpcomingEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

export const recordAttendance = async (req, res, next) => {
  try {
    const result = await eventService.checkIn(req.params.id, req.body.code);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
