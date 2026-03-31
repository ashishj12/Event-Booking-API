import pool from "../config/db.js";
import { generateCode } from "../utils/generateCode.js";
import { AppError } from "../middlewares/errorHandler.js";

export const createBooking = async ({ userId, eventId }) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Verify user exists
    const [[user]] = await conn.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if (!user) throw new AppError("User not found", 404);

    // Lock the event row to prevent race condition
    const [[event]] = await conn.query(
      "SELECT id, remaining_tickets FROM events WHERE id = ? FOR UPDATE",
      [eventId],
    );
    if (!event) throw new AppError("Event not found", 404);
    if (event.remaining_tickets < 1)
      throw new AppError("No tickets available", 409);

    // Prevent duplicate booking by same user for same event
    const [[duplicate]] = await conn.query(
      "SELECT id FROM bookings WHERE user_id = ? AND event_id = ?",
      [userId, eventId],
    );
    if (duplicate) throw new AppError("User already booked this event", 409);

    const code = generateCode();

    // Decrement ticket count atomically
    await conn.query(
      "UPDATE events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?",
      [eventId],
    );

    const [result] = await conn.query(
      "INSERT INTO bookings (user_id, event_id, code) VALUES (?, ?, ?)",
      [userId, eventId, code],
    );

    await conn.commit();

    return {
      bookingId: result.insertId,
      userId,
      eventId,
      code,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getBookingByCode = async (code) => {
  const [[booking]] = await pool.query(
    `SELECT b.id, b.code, b.booking_date,
            u.id AS userId, u.name, u.email,
            e.id AS eventId, e.title, e.date
     FROM bookings b
     JOIN users  u ON u.id = b.user_id
     JOIN events e ON e.id = b.event_id
     WHERE b.code = ?`,
    [code],
  );

  if (!booking) throw new AppError("Booking not found", 404);
  return booking;
};
