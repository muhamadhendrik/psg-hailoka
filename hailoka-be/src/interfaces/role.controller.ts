import { Request, Response } from "express";
import { RoleRepository } from "../infrastructure/repositories/role.repository";
import { CreateRoleUseCase } from "../app/use-cases/role/CreateRoleUseCase";
import { GetAllRolesUseCase } from "../app/use-cases/role/GetAllRolesUseCase";
import { GetRoleByIdUseCase } from "../app/use-cases/role/GetRoleByIdUseCase";
import { UpdateRoleUseCase } from "../app/use-cases/role/UpdateRoleUseCase";
import { DeleteRoleUseCase } from "../app/use-cases/role/DeleteRoleUseCase";
import { RoleCreateSchema } from "../app/dto/role/role-create.dto";
import { RoleUpdateSchema } from "../app/dto/role/role-update.dto";

const roleRepo = new RoleRepository();

export class RoleController {
  static async create(req: Request, res: Response) {
    try {
      const parsed = RoleCreateSchema.parse(req.body);
      const useCase = new CreateRoleUseCase(roleRepo);
      const result = await useCase.execute(parsed);

      return res.status(201).json({
        id: result.id,
        name: result.name,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const useCase = new GetAllRolesUseCase(roleRepo);
      const roles = await useCase.execute();

      return res.json(roles);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        return res.status(400).json({ error: "Invalid role ID" });
      }
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid role ID" });
      }

      const useCase = new GetRoleByIdUseCase(roleRepo);
      const role = await useCase.execute(id);

      return res.json({
        id: role.id,
        name: role.name,
      });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        return res.status(400).json({ error: "Invalid role ID" });
      }
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid role ID" });
      }

      const parsed = RoleUpdateSchema.parse(req.body);
      const useCase = new UpdateRoleUseCase(roleRepo);
      const result = await useCase.execute(id, parsed);

      return res.json({
        id: result.id,
        name: result.name,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        return res.status(400).json({ error: "Invalid role ID" });
      }
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid role ID" });
      }

      const useCase = new DeleteRoleUseCase(roleRepo);
      await useCase.execute(id);

      return res.json({ message: "Role deleted successfully" });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}

