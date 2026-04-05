import { z } from 'zod';

export const SubscriptionStatusSchema = z.enum(['trial', 'activa', 'inactiva']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  nombre: z.string().min(1),
  suscripcion: SubscriptionStatusSchema,
  fechaFinTrial: z.string().datetime().optional(),
  creadoEn: z.string().datetime(),
});

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type User = z.infer<typeof UserSchema>;
