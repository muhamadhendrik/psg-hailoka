import { z } from "zod";

export const OrganizationStatusUpdateSchema = z.object({
    organization_status_id: z.number().int().min(1).max(4),
    reviewer_notes: z.string().optional().nullable(),
    internal_notes: z.string().optional().nullable(),
});

export type OrganizationStatusUpdateDTO = z.infer<typeof OrganizationStatusUpdateSchema>;

