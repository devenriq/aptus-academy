import { z } from 'zod';

export const DifficultySchema = z.enum(['facil', 'medio', 'dificil']);

export const OptionSchema = z.object({
  id: z.string().uuid(),
  texto: z.string().min(1),
});

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  enunciado: z.string().min(1),
  anio: z.number().int().min(2000).max(2100),
  dificultad: DifficultySchema,
  materiaId: z.string().uuid(),
  opciones: z.array(OptionSchema).length(5),
  opcionCorrectaId: z.string().uuid(),
});

export const QuestionFiltersSchema = z.object({
  universidadId: z.string().uuid().optional(),
  materiaId: z.string().uuid().optional(),
  anio: z.number().int().optional(),
  dificultad: DifficultySchema.optional(),
});

export type Difficulty = z.infer<typeof DifficultySchema>;
export type Option = z.infer<typeof OptionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionFilters = z.infer<typeof QuestionFiltersSchema>;
