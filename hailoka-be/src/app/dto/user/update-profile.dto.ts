import { z } from "zod";

export const UpdateProfileSchema = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong").optional(),
    // Nanti kalau mau tambah field lain:
    // picturePath: z.string().url().optional(),
    // userType: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
