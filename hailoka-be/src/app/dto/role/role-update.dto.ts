import { z } from "zod";

export const RoleUpdateSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50, "Role name must be at most 50 characters"),
});

export type RoleUpdateRequestDTO = z.infer<typeof RoleUpdateSchema>;

export interface RoleUpdateResponseDTO {
  id: number;
  name: string;
}

