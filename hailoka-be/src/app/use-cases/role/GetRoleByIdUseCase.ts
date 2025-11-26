import { RoleRepository } from "../../../infrastructure/repositories/role.repository";
import { Role } from "../../../domain/role";

export class GetRoleByIdUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error("Role not found");
    }

    return role;
  }
}

