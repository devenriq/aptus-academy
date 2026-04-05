import { z } from 'zod';
import { QuestionFiltersSchema } from './question';

export const ExamSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  filtros: QuestionFiltersSchema,
  puntaje: z.number().min(0).max(100),
  totalPreguntas: z.number().int().min(1),
  creadoEn: z.string().datetime(),
});

export type Exam = z.infer<typeof ExamSchema>;
