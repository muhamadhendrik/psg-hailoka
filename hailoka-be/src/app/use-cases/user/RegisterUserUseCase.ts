import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { User } from "../../../domain/user";
import { UserRegistrationRequestDTO } from "../../dto/user/user-registration.dto";
import bcrypt from "bcrypt";

export class RegisterUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(data: UserRegistrationRequestDTO): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error("Email already registered");
        }

        // remove confirmPassword, only save hashed password
        const userToCreate = {
            name: data.name,
            email: data.email,
            picturePath: null,
            isVerifiedEmail: false,
            suspendedAt: null,
            deletedAt: null,
            userType: data.userType,
        };

        // save to repo
        const user = await this.userRepository.create(userToCreate);

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        user.hashedPassword = hashedPassword;

        await this.userRepository.createUserAuthMethod(user);

        return user;
    }
}
