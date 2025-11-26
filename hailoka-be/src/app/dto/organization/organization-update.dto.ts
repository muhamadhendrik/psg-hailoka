import { z } from "zod";

export const OrganizationUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    total_member: z.number().int().nonnegative().optional(),
    description: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    primary_contact_full_name: z.string().optional().nullable(),
    primary_contact_phone_number: z.string().optional().nullable(),
    primary_did_number: z.string().max(50).optional().nullable(),
});

export type OrganizationUpdateDTO = z.infer<typeof OrganizationUpdateSchema>;

