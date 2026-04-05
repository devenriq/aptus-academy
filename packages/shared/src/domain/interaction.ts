import { z } from 'zod';

export const InteractionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedOptionId: z.string().uuid(),
  isCorrect: z.boolean(),
  responseTime: z.number().int().min(0),
  examId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
});

export type Interaction = z.infer<typeof InteractionSchema>;
