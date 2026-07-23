import { z } from 'zod';

export const createInvitationSchema = z.object({
  targetEmail: z.string().email().optional(),
  targetPhone: z.string().optional(),
});

export const getTreeQuerySchema = z.object({
  depth: z.coerce.number().int().min(1).max(50).default(10),
  rootId: z.string().optional(),
});

export const getDownlineQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['pending', 'active', 'suspended']).optional(),
  search: z.string().optional(),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type GetTreeQueryInput = z.infer<typeof getTreeQuerySchema>;
export type GetDownlineQueryInput = z.infer<typeof getDownlineQuerySchema>;
