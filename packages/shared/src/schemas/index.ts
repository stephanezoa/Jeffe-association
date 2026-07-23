import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const inviteMemberSchema = z.object({
  targetEmail: z.string().email().optional(),
  targetPhone: z.string().optional(),
}).refine(data => data.targetEmail || data.targetPhone, {
  message: "Au moins un e-mail ou un téléphone est requis pour l'invitation.",
});

export const registerWithTokenSchema = z.object({
  token: z.string().min(1, "Le jeton d'invitation est requis"),
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type RegisterWithTokenInput = z.infer<typeof registerWithTokenSchema>;
