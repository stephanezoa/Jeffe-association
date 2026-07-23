import { z } from 'zod';

export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    summary: z.string().max(2000).optional().default(''),
    content: z.string().min(1),
    coverImageUrl: z.string().max(500).optional(),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

export const updateArticleSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    summary: z.string().max(2000).optional(),
    content: z.string().min(1).optional(),
    coverImageUrl: z.string().max(500).optional(),
    status: z.enum(['draft', 'published']).optional(),
  }),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>['body'];
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>['body'];
