import * as z from 'zod';

export const UserSchema = z.object({
  displayName: z.string(),
  email: z.string().email(),
  photoURL: z.string().url().nullable(),
  role: z.enum(['user', 'admin']),
  defaultProjectId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
