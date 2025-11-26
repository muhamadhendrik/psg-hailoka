import { User } from "../../../domain/user";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";

export class CreateUser {
  constructor(private userRepo: UserRepository) {}

  async execute(user: User): Promise<User> {
    return this.userRepo.create(user);
  }
}