import { z } from 'zod';

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const OptionSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1),
});

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  statement: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  difficulty: DifficultySchema,
  subjectId: z.string().uuid(),
  options: z.array(OptionSchema).length(5),
  correctOptionId: z.string().uuid(),
});

export const QuestionFiltersSchema = z.object({
  universityId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  year: z.number().int().optional(),
  difficulty: DifficultySchema.optional(),
});

export type Difficulty = z.infer<typeof DifficultySchema>;
export type Option = z.infer<typeof OptionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionFilters = z.infer<typeof QuestionFiltersSchema>;
