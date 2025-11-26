import { Role } from "../../domain/role";
import { RoleModel } from "../database/models/role.model";

export class RoleRepository {
  async create(data: { name: string }): Promise<Role> {
    const created = await RoleModel.create({
      name: data.name,
    });

    return this.toDomain(created.toJSON());
  }

  async findAll(): Promise<Role[]> {
    const roles = await RoleModel.findAll({ raw: true });
    return roles.map((r) => this.toDomain(r));
  }

  async findById(id: number): Promise<Role | null> {
    const role = await RoleModel.findByPk(id, { raw: true });
    return role ? this.toDomain(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await RoleModel.findOne({ where: { name }, raw: true });
    return role ? this.toDomain(role) : null;
  }

  async update(id: number, data: { name: string }): Promise<Role> {
    await RoleModel.update(
      { name: data.name },
      { where: { id } }
    );

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error("Role not found after update");
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await RoleModel.destroy({ where: { id } });
    if (deleted === 0) {
      throw new Error("Role not found");
    }
  }

  private toDomain(raw: any): Role {
    return {
      id: raw.id,
      name: raw.name,
    };
  }
}

