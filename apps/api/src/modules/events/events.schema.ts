import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    category: z.string().max(100).optional().default(''),
    eventType: z.enum(['free', 'paid']).default('free'),
    priceCents: z.coerce.number().int().min(0).optional().default(0),
    location: z.string().min(2).max(255),
    date: z.string().min(4), // ISO (AAAA-MM-JJ)
    capacity: z.coerce.number().int().min(0).optional().default(0),
    coverImageUrl: z.string().max(500).optional(),
    description: z.string().max(4000).optional().default(''),
    content: z.string().optional().default(''),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

export const updateEventSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    category: z.string().max(100).optional(),
    eventType: z.enum(['free', 'paid']).optional(),
    priceCents: z.coerce.number().int().min(0).optional(),
    location: z.string().min(2).max(255).optional(),
    date: z.string().min(4).optional(),
    capacity: z.coerce.number().int().min(0).optional(),
    coverImageUrl: z.string().max(500).optional(),
    description: z.string().max(4000).optional(),
    content: z.string().optional(),
    status: z.enum(['draft', 'published']).optional(),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];
