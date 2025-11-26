import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserAuthMethodsRepository } from "../../../infrastructure/repositories/user-auth.repository";
export class ResetPasswordUseCase {

  constructor(private authRepo: UserAuthMethodsRepository) {}

  async execute(token: string, newPassword: string): Promise<void> {

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
        userId: string;
        email: string;
      };

      const hashed = await bcrypt.hash(newPassword, 10);

      await this.authRepo.updatePassword(decoded.userId, hashed);

    } catch (err) {

      throw new Error("Invalid or expired token");

    }
  }
}