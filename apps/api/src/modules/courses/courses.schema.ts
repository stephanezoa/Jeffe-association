import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    description: z.string().max(4000).optional().default(''),
    duration: z.string().max(50).optional().default(''),
    tags: z.array(z.string().max(60)).max(10).optional().default([]),
    thumbnailUrl: z.string().max(500).optional(),
    introVideoUrl: z.string().max(500).optional().default(''),
    content: z.string().optional().default(''),
    status: z.enum(['draft', 'published', 'done']).default('draft'),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    description: z.string().max(4000).optional(),
    duration: z.string().max(50).optional(),
    tags: z.array(z.string().max(60)).max(10).optional(),
    thumbnailUrl: z.string().max(500).optional(),
    introVideoUrl: z.string().max(500).optional(),
    content: z.string().optional(),
    status: z.enum(['draft', 'published', 'done']).optional(),
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>['body'];
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>['body'];
