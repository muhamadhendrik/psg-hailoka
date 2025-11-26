import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { UserAuthMethodsRepository } from "../../../infrastructure/repositories/user-auth.repository";
import { UserLoginRequestDTO, UserLoginResponseDTO } from "../../dto/user/user-login.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {

  constructor(
    private userRepository: UserRepository,
    private authMethodsRepository: UserAuthMethodsRepository
  ) {}

  async execute(data: UserLoginRequestDTO): Promise<UserLoginResponseDTO> {

    // 1. Find user_auth_methods entry
    const authMethod = await this.authMethodsRepository.findPasswordAuthByEmail(data.email);

    if (!authMethod) {
      throw new Error("Invalid credentials");
    }

    // 2. Check password
    const validPassword = await bcrypt.compare(data.password, authMethod.password_hash || "");
    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    // 3. Get user record
    const user = await this.userRepository.findById(authMethod.user_id);
    if (!user) {
      throw new Error("User not found");
    }

    // 4. Sign JWT
    const token = jwt.sign(
      {
        user_id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7h" }
    );

    return { token };
  }
  
}