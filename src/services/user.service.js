import pool from '../config/db.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getUserBookings = async (userId) => {
  const [bookings] = await pool.query(
    `SELECT b.id, b.booking_code AS code, b.booking_date,
            e.title, e.description, e.date,
            e.total_capacity, e.remaining_tickets
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     WHERE b.user_id = ?
     ORDER BY b.booking_date DESC`,
    [userId]
  );

  if (!bookings.length) {
    const [[user]] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) throw new AppError('User not found', 404);
  }

  return bookings;
};

export const createUser = async ({ name, email }) => {
  const [[existing]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) throw new AppError('Email already registered', 409);

  const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);

  return { id: result.insertId, name, email };
};
