import { RoleRepository } from "../../../infrastructure/repositories/role.repository";

export class DeleteRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: number): Promise<void> {
    // Check if role exists
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new Error("Role not found");
    }

    // Delete role
    await this.roleRepository.delete(id);
  }
}

