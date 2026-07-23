import axios from 'axios';

/**
 * Petites fonctions d'accès à l'API. L'en-tête Authorization est déjà posé
 * globalement par lib/auth ; on renvoie directement `response.data.data`.
 */

const unwrap = <T>(promise: Promise<{ data: { data: T } }>): Promise<T> =>
  promise.then((res) => res.data.data);

/** Envoie un data URL d'image et renvoie l'URL hébergée (`/uploads/...`). */
export async function uploadImage(dataUrl: string): Promise<string> {
  const { url } = await unwrap<{ url: string }>(axios.post('/api/v1/uploads', { dataUrl }));
  return url;
}

/**
 * Si `cover` est un data URL fraîchement déposé, l'upload et renvoie l'URL
 * hébergée. Si c'est déjà une URL (`/uploads/...` ou `/images/...`), la renvoie
 * telle quelle. `null` reste `null`.
 */
export async function resolveCover(cover: string | null): Promise<string | undefined> {
  if (!cover) return undefined;
  if (cover.startsWith('data:')) return uploadImage(cover);
  return cover;
}

// ---- Articles ----------------------------------------------------------------

export interface ApiArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImageUrl: string | null;
  status: 'draft' | 'published';
  author?: string;
  publishedAt: string | null;
  createdAt: string;
}

export const articlesApi = {
  listPublished: () => unwrap<ApiArticle[]>(axios.get('/api/v1/articles')),
  getBySlug: (slug: string) => unwrap<ApiArticle>(axios.get(`/api/v1/articles/${slug}`)),
  listMine: () => unwrap<ApiArticle[]>(axios.get('/api/v1/articles/mine')),
  create: (body: Partial<ApiArticle>) => unwrap<ApiArticle>(axios.post('/api/v1/articles', body)),
  update: (id: string, body: Partial<ApiArticle>) => unwrap<ApiArticle>(axios.patch(`/api/v1/articles/${id}`, body)),
  remove: (id: string) => unwrap<{ message: string }>(axios.delete(`/api/v1/articles/${id}`)),
};

// ---- Courses (formations) ----------------------------------------------------

export interface ApiCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  tags: string[];
  thumbnailUrl: string | null;
  introVideoUrl: string;
  content: string;
  status: 'draft' | 'published' | 'done';
  createdAt: string;
}

export const coursesApi = {
  listMine: () => unwrap<ApiCourse[]>(axios.get('/api/v1/courses/mine')),
  create: (body: Partial<ApiCourse>) => unwrap<ApiCourse>(axios.post('/api/v1/courses', body)),
  update: (id: string, body: Partial<ApiCourse>) => unwrap<ApiCourse>(axios.patch(`/api/v1/courses/${id}`, body)),
  remove: (id: string) => unwrap<{ message: string }>(axios.delete(`/api/v1/courses/${id}`)),
};

// ---- Events ------------------------------------------------------------------

export interface ApiEvent {
  id: string;
  slug: string;
  title: string;
  category: string;
  eventType: 'free' | 'paid';
  priceCents: number;
  location: string;
  date: string;
  capacity: number;
  coverImageUrl: string | null;
  description: string;
  content: string;
  status: 'draft' | 'published';
  ticketsSold: number;
  displayStatus: 'full' | 'expired' | null;
}

export const eventsApi = {
  listMine: () => unwrap<ApiEvent[]>(axios.get('/api/v1/events/mine')),
  create: (body: Record<string, unknown>) => unwrap<ApiEvent>(axios.post('/api/v1/events', body)),
  update: (id: string, body: Record<string, unknown>) => unwrap<ApiEvent>(axios.patch(`/api/v1/events/${id}`, body)),
  remove: (id: string) => unwrap<{ message: string }>(axios.delete(`/api/v1/events/${id}`)),
};

// ---- Membre / compte ---------------------------------------------------------

export const accountApi = {
  me: () => unwrap<any>(axios.get('/api/v1/members/me')),
  updateProfile: (body: Record<string, unknown>) => unwrap<any>(axios.patch('/api/v1/members/me', body)),
  changePassword: (currentPassword: string, newPassword: string) =>
    unwrap<{ message: string }>(axios.post('/api/v1/auth/change-password', { currentPassword, newPassword })),
};
