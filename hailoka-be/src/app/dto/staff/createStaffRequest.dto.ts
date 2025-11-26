import { z } from "zod";

export const CreateStaffSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  roleId: z.number(),
  organizationId: z.string(), //uuid
  extensions: z.array(z.string()).optional(), //uuid[]
});

export type CreateStaffRequestDTO = z.infer<typeof CreateStaffSchema>;