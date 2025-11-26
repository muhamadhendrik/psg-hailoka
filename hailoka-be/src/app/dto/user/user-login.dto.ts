import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export type UserLoginRequestDTO = z.infer<typeof UserLoginSchema>;

export interface UserLoginResponseDTO {
  token: string;
}