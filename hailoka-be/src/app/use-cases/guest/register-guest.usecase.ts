import jwt from "jsonwebtoken";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { UserAuthMethodsRepository } from "../../../infrastructure/repositories/user-auth.repository";
import { User } from "../../../domain/user";

export class RegisterGuestUseCase {
  
  constructor(
    private userRepo: UserRepository,
    private authRepo: UserAuthMethodsRepository
  ) {}

  async execute(name: string): Promise<{ token: string }> {

    // 1. create user in `users` table
    const newUser: Omit<User, "id" | "createdAt" | "updatedAt"> = {
      name,
      email: null,
      picturePath: null,
      isVerifiedEmail: false,
      suspendedAt: null,
      deletedAt: null,
      userType: "guest",
    };

    const createdUser = await this.userRepo.create(newUser);

    // 2. generate JWT token for guest
    const token = jwt.sign(
      { userId: createdUser.id, name: createdUser.name, userType: createdUser.userType },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // 3. insert into `user_auth_methods`
    await this.authRepo.create({
      userId: createdUser.id,
      provider: "guest_token",
      providerUserId: token,
      lastLoginAt: new Date(),
    });

    return { token };

  }
}
