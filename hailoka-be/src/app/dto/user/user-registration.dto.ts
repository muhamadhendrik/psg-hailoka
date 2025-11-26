import { z } from "zod";

export const UserRegistrationSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm Password is required"),
        userType: z.enum(["guest", "superadmin", "user"]).default("user"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"], // highlight confirmPassword field in error
        message: "Passwords do not match",
    });

// Request DTO type inferred from schema
export type UserRegistrationRequestDTO = z.infer<typeof UserRegistrationSchema>;

// Response DTO
export interface UserRegistrationResponseDTO {
    id: string;
    name: string;
    email: string;
    is_verified_email: boolean;
    created_at: Date;
}
