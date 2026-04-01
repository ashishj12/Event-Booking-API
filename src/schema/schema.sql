CREATE DATABASE IF NOT EXISTS event_booking_api;
USE event_booking_api;

--Users Table
CREATE TABLE IF NOT EXISTS users(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  description       TEXT,
  date              DATETIME NOT NULL,
  total_capacity    INT UNSIGNED NOT NULL,
  remaining_tickets INT UNSIGNED NOT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_remaining CHECK (remaining_tickets <= total_capacity)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  event_id     INT UNSIGNED NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  booking_code VARCHAR(64) NOT NULL UNIQUE,
  CONSTRAINT fk_booking_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_booking_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Event Attendance table
CREATE TABLE IF NOT EXISTS event_attendance (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  event_id   INT UNSIGNED NOT NULL,
  entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_attendance_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);





