import { RoleRepository } from "../../../infrastructure/repositories/role.repository";
import { Role } from "../../../domain/role";
import { RoleCreateRequestDTO } from "../../dto/role/role-create.dto";

export class CreateRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(data: RoleCreateRequestDTO): Promise<Role> {
    // Check if role name already exists
    const existingRole = await this.roleRepository.findByName(data.name);
    if (existingRole) {
      throw new Error("Role name already exists");
    }

    // Create new role
    const role = await this.roleRepository.create({
      name: data.name,
    });

    return role;
  }
}

