import { z } from "zod";

export const OrganizationStatusUpdateSchema = z.object({
    reviewer_notes: z.string().optional().nullable(),
    internal_notes: z.string().optional().nullable(),
}).optional().default({});

export type OrganizationStatusUpdateDTO = z.infer<typeof OrganizationStatusUpdateSchema>;

