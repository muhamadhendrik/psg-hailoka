import { z } from "zod";

export const EditStaffSchema = z.object({
  userId: z.string(), // uuid
  name: z.string().min(1).optional(),
  email: z.email().optional(), // uuid
  roleId: z.number().optional(),
  extensions: z.array(z.string()).optional(),
});

export type EditStaffRequestDTO = z.infer<typeof EditStaffSchema>;