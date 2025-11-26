import { z } from "zod";

export const ForgotPasswordRequestSchema = z.object({
  email: z.email("Invalid email format"),
});

export type ForgotPasswordRequestDTO = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type ResetPasswordRequestDTO = z.infer<typeof ResetPasswordRequestSchema>;
