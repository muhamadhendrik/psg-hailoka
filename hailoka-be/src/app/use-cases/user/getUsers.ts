import { UserRepository } from "../../../infrastructure/repositories/user.repository";

export class GetUsers {
  constructor(private userRepo: UserRepository) {}

  async execute() {
    return this.userRepo.findAll();
  }
}