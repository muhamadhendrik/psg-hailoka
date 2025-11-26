import bcrypt from "bcrypt";
import { UserAuthMethodsRepository } from "../../../infrastructure/repositories/user-auth.repository";

interface ChangePasswordInput {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export class ChangePasswordUseCase {
    constructor(private authRepo: UserAuthMethodsRepository) {}

    async execute(input: ChangePasswordInput): Promise<void> {
        const auth = await this.authRepo.findPasswordAuthByUserId(input.userId);

        if (!auth || !auth.password_hash) {
            throw new Error("Password authentication not found for this user");
        }

        const isMatch = await bcrypt.compare(
            input.currentPassword,
            auth.password_hash
        );

        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }

        const newHashedPassword = await bcrypt.hash(input.newPassword, 10);

        await this.authRepo.updatePassword(input.userId, newHashedPassword);
    }
}
