import * as userService from '../services/user.service.js';

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await userService.getUserBookings(Number(req.params.id));
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};
