import { z } from 'zod';

export const InteractionSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  preguntaId: z.string().uuid(),
  opcionSeleccionadaId: z.string().uuid(),
  esCorrecta: z.boolean(),
  tiempoRespuesta: z.number().int().min(0),
  examenSimuladoId: z.string().uuid().optional(),
  creadoEn: z.string().datetime(),
});

export type Interaction = z.infer<typeof InteractionSchema>;
