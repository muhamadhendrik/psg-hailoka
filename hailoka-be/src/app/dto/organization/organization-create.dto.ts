import { z } from "zod";

export const OrganizationCreateSchema = z.object({
  name: z.string().min(2),
  total_member: z.number().int().nonnegative().optional().default(1),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  primary_contact_full_name: z.string().optional().nullable(),
  primary_contact_phone_number: z.string().optional().nullable(),
  internal_notes: z.string().optional().nullable(),
});

export type OrganizationCreateDTO = z.infer<typeof OrganizationCreateSchema>;