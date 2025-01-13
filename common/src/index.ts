import { z } from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

//type infer in zod

export const blogInput = z.object({
  title: z.string(),
  content: z.string(),
});

//type infer in zod

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  id: z.number(),
});

export type signupInput = z.infer<typeof signupInput>;
export type signinInput = z.infer<typeof signinInput>;
export type createBlogInput = z.infer<typeof createBlogInput>;
export type updateBlogInput = z.infer<typeof updateBlogInput>;
