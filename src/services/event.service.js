import pool from '../config/db.js';
import { generateCode } from '../utils/generateCode.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createBooking = async ({ userId, eventId }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // FOR UPDATE locks the row until the transaction commits.
    // No other transaction can read or write this row in between.
    const [[event]] = await conn.query(
      'SELECT id, remaining_tickets FROM events WHERE id = ? FOR UPDATE',
      [eventId]
    );
    if (!event) throw new AppError('Event not found', 404);
    if (event.remaining_tickets < 1) throw new AppError('No tickets available', 409);

    const code = generateCode(); // e.g. "EVT-A3X9K2"

    await conn.query('UPDATE events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?', [
      eventId,
    ]);

    const [result] = await conn.query(
      'INSERT INTO bookings (user_id, event_id, code) VALUES (?, ?, ?)',
      [userId, eventId, code]
    );

    await conn.commit();

    return { bookingId: result.insertId, code };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release(); // always release back to pool
  }
};
