import { z } from "zod";

export const CallFeedbackCreateSchema = z.object({
  call_id: z.string().uuid(),
  kind: z.enum(["GUEST", "USER"]),
  ref_id: z.string().uuid(),
  score: z.number().int().min(1).max(5),
  feedback: z.string().max(500).optional().nullable(),
});

export type CallFeedbackCreateDTO = z.infer<typeof CallFeedbackCreateSchema>;

export const CallFeedbackUpdateSchema = z.object({
  score: z.number().int().min(1).max(5).optional(),
  feedback: z.string().max(500).optional().nullable(),
});

export type CallFeedbackUpdateDTO = z.infer<typeof CallFeedbackUpdateSchema>;

