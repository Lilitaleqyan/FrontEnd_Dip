import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.enum(["admin", "client"]),
});

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  coverUrl: z.string(),
  category: z.enum(["fiction", "science", "educational", "audiobook"]),
  content: z.string().optional(),
  audioUrl: z.string().optional(),
  duration: z.string().optional(),
  narrator: z.string().optional(),
  pages: z.number().optional(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  createdAt: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true });
export const insertBookSchema = bookSchema.omit({
  id: true,
  createdAt: true,
  rating: true,
  reviewCount: true,
});
