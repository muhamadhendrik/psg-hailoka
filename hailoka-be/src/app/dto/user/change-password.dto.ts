import { z } from "zod";

export const ChangePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(6, "Current password minimal 6 karakter"),
        newPassword: z.string().min(6, "New password minimal 6 karakter"),
        confirmNewPassword: z
            .string()
            .min(6, "Konfirmasi password minimal 6 karakter"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Konfirmasi password tidak sama",
        path: ["confirmNewPassword"],
    });

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
