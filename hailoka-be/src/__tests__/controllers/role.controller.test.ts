import { RoleController } from '../../interfaces/role.controller';
import { createMockRequest, createMockResponse, mockRole } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/role.repository');
jest.mock('../../app/use-cases/role/CreateRoleUseCase');
jest.mock('../../app/use-cases/role/GetAllRolesUseCase');
jest.mock('../../app/use-cases/role/GetRoleByIdUseCase');
jest.mock('../../app/use-cases/role/UpdateRoleUseCase');
jest.mock('../../app/use-cases/role/DeleteRoleUseCase');

describe('RoleController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('create', () => {
    it('should create a role successfully', async () => {
      req.body = { name: 'admin' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockRole),
      };
      (require('../../app/use-cases/role/CreateRoleUseCase').CreateRoleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: mockRole.id,
        name: mockRole.name,
      });
    });

    it('should return 400 if role name already exists', async () => {
      req.body = { name: 'admin' };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Role name already exists')),
      };
      (require('../../app/use-cases/role/CreateRoleUseCase').CreateRoleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Role name already exists',
      });
    });

    it('should return 400 if validation fails', async () => {
      req.body = { name: '' };

      await RoleController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe('getAll', () => {
    it('should return all roles', async () => {
      const roles = [mockRole, { id: 2, name: 'user' }];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(roles),
      };
      (require('../../app/use-cases/role/GetAllRolesUseCase').GetAllRolesUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith(roles);
    });

    it('should handle errors', async () => {
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      (require('../../app/use-cases/role/GetAllRolesUseCase').GetAllRolesUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getById', () => {
    it('should return a role by id', async () => {
      req.params = { id: '1' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockRole),
      };
      (require('../../app/use-cases/role/GetRoleByIdUseCase').GetRoleByIdUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: mockRole.id,
        name: mockRole.name,
      });
    });

    it('should return 400 for invalid id', async () => {
      req.params = { id: 'invalid' };

      await RoleController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid role ID',
      });
    });

    it('should return 404 if role not found', async () => {
      req.params = { id: '999' };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Role not found')),
      };
      (require('../../app/use-cases/role/GetRoleByIdUseCase').GetRoleByIdUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Role not found',
      });
    });
  });

  describe('update', () => {
    it('should update a role successfully', async () => {
      req.params = { id: '1' };
      req.body = { name: 'updated-admin' };
      const updatedRole = { ...mockRole, name: 'updated-admin' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(updatedRole),
      };
      (require('../../app/use-cases/role/UpdateRoleUseCase').UpdateRoleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: updatedRole.id,
        name: updatedRole.name,
      });
    });

    it('should return 400 if role name already exists', async () => {
      req.params = { id: '1' };
      req.body = { name: 'existing-role' };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Role name already exists')),
      };
      (require('../../app/use-cases/role/UpdateRoleUseCase').UpdateRoleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Role name already exists',
      });
    });
  });

  describe('delete', () => {
    it('should delete a role successfully', async () => {
      req.params = { id: '1' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      (require('../../app/use-cases/role/DeleteRoleUseCase').DeleteRoleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Role deleted successfully',
      });
    });

    it('should return 404 if role not found', async () => {
      req.params = { id: '999' };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Role not found')),
      };
      (require('../../app/use-cases/role/DeleteRoleUseCase').DeleteRoleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await RoleController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Role not found',
      });
    });
  });
});

