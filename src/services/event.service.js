import pool from '../config/db.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getUpcomingEvents = async () => {
  const [events] = await pool.query(
    `SELECT id, title, description, date, total_capacity, remaining_tickets, created_at
     FROM events
     WHERE date > NOW()
     ORDER BY date ASC`
  );
  return events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));
};

export const createEvent = async ({ title, description, date, capacity }) => {
  const mysqlDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  const [result] = await pool.query(
    `INSERT INTO events (title, description, date, total_capacity, remaining_tickets)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description ?? null, mysqlDate, capacity, capacity]
  );

  return {
    id: result.insertId,
    title,
    description: description ?? null,
    date: mysqlDate,
    total_capacity: capacity,
    remaining_tickets: capacity,
  };
};

export const checkIn = async (eventId, code) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const [[booking]] = await conn.query(
      `SELECT b.id, b.user_id
       FROM bookings b
       WHERE b.booking_code = ? AND b.event_id = ?`,
      [code, eventId]
    );
    if (!booking) throw new AppError('Invalid booking code for this event', 404);

    // Prevent duplicate check-in
    const [[alreadyCheckedIn]] = await conn.query(
      'SELECT id FROM event_attendance WHERE user_id = ? AND event_id = ?',
      [booking.user_id, eventId]
    );
    if (alreadyCheckedIn) throw new AppError('Attendee already checked in', 409);
    const [result] = await conn.query(
      'INSERT INTO event_attendance (user_id, event_id) VALUES (?, ?)',
      [booking.user_id, eventId]
    );

    await conn.commit();
    return {
      attendanceId: result.insertId,
      userId: booking.user_id,
      eventId: Number(eventId),
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
