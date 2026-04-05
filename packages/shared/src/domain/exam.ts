import { z } from 'zod';
import { QuestionFiltersSchema } from './question';

export const ExamSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  filters: QuestionFiltersSchema,
  score: z.number().min(0).max(100),
  totalQuestions: z.number().int().min(1),
  createdAt: z.string().datetime(),
});

export type Exam = z.infer<typeof ExamSchema>;
