import { z } from "zod";

export const RoleCreateSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50, "Role name must be at most 50 characters"),
});

export type RoleCreateRequestDTO = z.infer<typeof RoleCreateSchema>;

export interface RoleCreateResponseDTO {
  id: number;
  name: string;
}

