import { z } from "zod";

export const CallParticipantCreateSchema = z.object({
  call_id: z.string().uuid(),
  role: z.enum(["host", "caller", "recipient"]),
  kind: z.enum(["user", "guest", "extension"]),
  ref_id: z.string().uuid(),
});

export type CallParticipantCreateDTO = z.infer<typeof CallParticipantCreateSchema>;

