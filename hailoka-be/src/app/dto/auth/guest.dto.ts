import { z } from "zod";

export const GuestRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type GuestRegistrationRequestDTO = z.infer<typeof GuestRegistrationSchema>;

export interface GuestRegistrationResponseDTO {
  token: string;
}
