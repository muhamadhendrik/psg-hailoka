import jwt from "jsonwebtoken";

import { UserAuthMethodsRepository } from "../../../infrastructure/repositories/user-auth.repository";
import { EmailService } from "../../../domain/email";

// UserAuthMethodRepository

export class ForgotPasswordUseCase {
  constructor(
    private authRepo: UserAuthMethodsRepository,
    private emailService: EmailService
  ) {}

  async execute(email: string): Promise<void> {
    const authMethod = await this.authRepo.findByEmail(email);
    if (!authMethod) {
      throw new Error("Email not found");
    }

    // generate reset token (expires in 15 minutes)
    const token = jwt.sign(
      { userId: authMethod.user_id, email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.emailService.sendMail(
      email,
      "Password Reset Request",
      `<p>Click the link to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );
  }
}