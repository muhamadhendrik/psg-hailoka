import { z } from "zod";

export const CallEventCreateSchema = z.object({
  call_id: z.string().uuid(),
  call_participant_id: z.number().int().positive().nullable().optional(),
  attempt_count: z.number().int().min(0).default(0).optional(),
  event_type: z.enum([
    "created", "queued", "queue_updated", "dial_attempt", "ringing", "answered",
    "hold", "unhold", "forward", "forward_ringing", "forward_answered",
    "forward_no_answer", "forward_busy", "transfer", "transfer_ringing",
    "transfer_answered", "transfer_no_answer", "transfer_busy",
    "transfer_consulting", "transfer_connecting", "transfer_completed",
    "transfer_failed", "transfer_canceled", "transfer_attended",
    "rejected", "busy", "timeout", "missed", "canceled", "failed", "ended"
  ]),
  queue_count: z.number().int().min(0).default(0).optional(),
});

export type CallEventCreateDTO = z.infer<typeof CallEventCreateSchema>;

