import { z } from "zod";

export const ExtensionConfigurationUpdateSchema = z.object({
  ring_timeout_seconds: z
    .number()
    .int()
    .min(1, "Ring timeout must be at least 1 second")
    .max(300, "Ring timeout must be at most 300 seconds")
    .optional(),
  max_concurrent_calls: z
    .number()
    .int()
    .min(1, "Max concurrent calls must be at least 1")
    .max(100, "Max concurrent calls must be at most 100")
    .optional(),
  is_record_a_call: z
    .boolean()
    .optional(),
});

export type ExtensionConfigurationUpdateDTO = z.infer<typeof ExtensionConfigurationUpdateSchema>;

export interface ExtensionConfigurationResponseDTO {
  ring_timeout_seconds: number;
  max_concurrent_calls: number;
  is_record_a_call: boolean;
}

