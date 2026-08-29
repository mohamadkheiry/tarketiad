import { z } from "zod";

const phone = z.string().trim().regex(/^(?:\+98|0)?9\d{9}$|^0\d{10}$/, "شماره تماس معتبر نیست");

export const consultationSchema = z.object({
  fullName: z.string().trim().min(3).max(80),
  phone,
  requestType: z.string().trim().min(2).max(80),
  preferredTime: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(1000).optional().default(""),
  website: z.string().max(0).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(200),
});
