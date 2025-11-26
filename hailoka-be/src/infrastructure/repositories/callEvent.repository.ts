import { CallEvent } from "../database/models";

export type CreateCallEventDTO = {
    call_id: string;
    call_participant_id: number | null;
    attempt_count: number;
    event_type: 
        | "created" | "queued" | "queue_updated" | "dial_attempt" | "ringing" | "answered"
        | "hold" | "unhold" | "forward" | "forward_ringing" | "forward_answered"
        | "forward_no_answer" | "forward_busy" | "transfer" | "transfer_ringing"
        | "transfer_answered" | "transfer_no_answer" | "transfer_busy"
        | "transfer_consulting" | "transfer_connecting" | "transfer_completed"
        | "transfer_failed" | "transfer_canceled" | "transfer_attended"
        | "rejected" | "busy" | "timeout" | "missed" | "canceled" | "failed" | "ended";
    queue_count: number;
};

export class CallEventRepository {

    /**
        * Create a new call event record
   */

    async create(data: CreateCallEventDTO) {
        try {
          const insertedCallEvent = await CallEvent.create(data);
          return insertedCallEvent;
        } catch (error) {
          console.error("[CallEventRepository.create] Error:", error);
          throw new Error("Failed to create call event");
        }
      }

}