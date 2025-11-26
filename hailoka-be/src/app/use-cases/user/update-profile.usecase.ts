import { UserRepository } from "../../../infrastructure/repositories/user.repository";

interface UpdateProfileInput {
    userId: string;
    name?: string | undefined;
}

export class UpdateProfileUseCase {
    constructor(private userRepo: UserRepository) {}

    async execute(input: UpdateProfileInput) {
        const user = await this.userRepo.findById(input.userId);
        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser = await this.userRepo.updateProfile(input.userId, {
            name: input.name,
        });

        return updatedUser;
    }
}
