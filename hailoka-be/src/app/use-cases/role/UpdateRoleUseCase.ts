import { RoleRepository } from "../../../infrastructure/repositories/role.repository";
import { Role } from "../../../domain/role";
import { RoleUpdateRequestDTO } from "../../dto/role/role-update.dto";

export class UpdateRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: number, data: RoleUpdateRequestDTO): Promise<Role> {
    // Check if role exists
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new Error("Role not found");
    }

    // Check if new name already exists (excluding current role)
    const roleWithSameName = await this.roleRepository.findByName(data.name);
    if (roleWithSameName && roleWithSameName.id !== id) {
      throw new Error("Role name already exists");
    }

    // Update role
    const updatedRole = await this.roleRepository.update(id, {
      name: data.name,
    });

    return updatedRole;
  }
}

