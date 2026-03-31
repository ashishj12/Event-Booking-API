import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, "title is required").trim(),
    description: z.string().trim().optional(),
    date: z.string().datetime({ message: "date must be ISO8601 datetime" }),
    capacity: z.number().int().positive("capacity must be a positive integer"),
  }),
});

export const attendanceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "event id must be a positive integer"),
  }),
  body: z.object({
    code: z.string().min(1, "code is required").trim(),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    userId: z.number().int().positive("userId must be a positive integer"),
    eventId: z.number().int().positive("eventId must be a positive integer"),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "name is required").trim(),
    email: z.string().email("valid email is required"),
  }),
});

export const getUserBookingsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "user id must be a positive integer"),
  }),
});
