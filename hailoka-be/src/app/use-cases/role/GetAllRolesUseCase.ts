import { RoleRepository } from "../../../infrastructure/repositories/role.repository";
import { Role } from "../../../domain/role";

export class GetAllRolesUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }
}

