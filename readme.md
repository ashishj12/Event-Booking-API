# Event Booking System

A RESTful API for managing events and ticket bookings. Built with Node.js, Express, MySQL. Includes Swagger documentation and Docker support.

---

## Tech Stack

- **Runtime** — Node.js 22(LTS)
- **Framework** — Express.js
- **Database** — MySQL 
- **Validation** — Zod
- **Documentation** — Swagger UI (OpenAPI 3.0)
- **Containerisation** — Docker + Docker Compose

## Prerequisites

- Node.js v22
- MySQL 8
- npm
- Docker + Docker Compose _(optional — for containerised setup)_

---

## Option A — Run with Docker (recommended)

This is the fastest way. One command brings up the Node server and MySQL together.

**1. Clone the repository**

```bash
git clone https://github.com/ashishj12/Event-Booking-API.git
cd Event-Booking-API
```

**2. Create your environment file**

```bash
cp .env.example .env
```

The default `.env` values work out of the box with Docker Compose — no changes needed unless you want to customise ports.

**3. Start everything**

```bash
docker compose up --build
```

This will:

- Pull MySQL 8 and wait for it to be healthy
- Automatically run `schema/schema.sql` to create all tables
- Build and start the Node.js app on port 3000

**4. Verify it's running**

```
http://localhost:5000/api/v1/events
http://localhost:5000/api-docs
```

**To stop:**

```bash
docker compose down
```

**To stop and wipe the database volume:**

```bash
docker compose down -v
```

---

## Option B — Run locally (manual setup)

**1. Clone the repository**

```bash
git clone https://github.com/ashishj12/Event-Booking-API.git
cd Event-Booking-API
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Set up the database**

Log into MySQL and run the schema file:

```bash
mysql -u root -p < src/schema/schema.sql
```

Or in MySQL Workbench / any GUI client, open and execute `schema/schema.sql`.

**4. Configure environment variables**

```bash
cp .env.example .env
```

### Note 

There is one issue, before starting the dev server in MySQL Workbench run the database creation query manually.

```bash
CREATE DATABSE IF NOT EXISTS event_booking_api
```

Open `.env` and fill in your values:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_booking
```

### Note 

While building this API I use node.js 22 LTS Version, In this we don't need to install external package like nodemon and dotenv, in package.json file by default include watch mode and load env file.

**5. Start the development server**

```bash
pnpm run dev
```

Or for production:

```bash
pnpm start
```

The server will be available at `http://localhost:5000`.

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint                 | Description                          |
| ------ | ------------------------ | ------------------------------------ |
| `POST` | `/users`                 | Create a new user                    |
| `GET`  | `/users/:id/bookings`    | Get all bookings for a user          |
| `GET`  | `/events`                | List all upcoming events             |
| `POST` | `/events`                | Create a new event                   |
| `POST` | `/events/:id/attendance` | Record attendance using booking code |
| `POST` | `/bookings`              | Book a ticket for an event           |

---

## API Documentation

Interactive Swagger docs are available at:

```
http://localhost:5000/api-docs
```

All request bodies, response schemas, and error formats are documented there.

---

## Database Schema

The schema lives in `schema/schema.sql` and creates four tables:

- **users** — `id`, `name`, `email` (unique), `created_at`
- **events** — `id`, `title`, `description`, `date`, `total_capacity`, `remaining_tickets`
- **bookings** — `id`, `user_id` (FK), `event_id` (FK), `code` (unique), `booking_date`
- **event_attendance** — `id`, `booking_id` (FK, unique), `user_id` (FK), `entry_time`

Foreign key constraints are enforced at the database level. A unique constraint on `(user_id, event_id)` in bookings prevents duplicate bookings.

---

## Key Technical Details

**Race condition handling** — Booking a ticket uses a MySQL transaction with `SELECT ... FOR UPDATE` to lock the event row. This prevents two simultaneous requests from overselling when only one ticket remains.

**Unique booking code** — Generated using `randomBytes` from Node's built-in `node:crypto` module. Format: `EVT-XXXXXXXX`.

**Validation** — All request inputs are validated with Zod schemas before reaching the controller. Invalid requests return `422` with field-level error details.

**Error handling** — A global Express error handler catches all thrown errors. Custom `AppError` instances carry an HTTP status code; unhandled errors default to `500`.

## Scripts

| Command       | Description                                       |
| ------------- | ------------------------------------------------- |
| `pnpm run dev` | Start with nodemon (auto-restart on file changes) |
| `pnpm start`   | Start in production mode                          |
