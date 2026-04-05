import { z } from 'zod';

export const SubscriptionStatusSchema = z.enum(['trial', 'active', 'inactive']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  subscription: SubscriptionStatusSchema,
  trialEndsAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
});

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type User = z.infer<typeof UserSchema>;
