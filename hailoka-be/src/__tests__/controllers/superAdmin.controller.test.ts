import { SuperAdminController } from '../../interfaces/superAdmin.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/organization.repository');
jest.mock('../../infrastructure/repositories/user.repository');
jest.mock('../../infrastructure/mailer/nodemailer.service');
jest.mock('../../app/use-cases/super-admin/GetSuperAdminDashboardUseCase');
jest.mock('../../app/use-cases/super-admin/GetAllUsersUseCase');
jest.mock('../../app/use-cases/super-admin/GetUserByIdUseCase');
jest.mock('../../app/use-cases/super-admin/SuspendUserUseCase');
jest.mock('../../app/use-cases/super-admin/ActivateUserUseCase');
jest.mock('../../app/use-cases/super-admin/ApproveOrganizationUseCase');
jest.mock('../../app/use-cases/super-admin/RejectOrganizationUseCase');
jest.mock('../../app/use-cases/super-admin/SuspendOrganizationUseCase');
jest.mock('../../app/use-cases/super-admin/ActivateOrganizationUseCase');

describe('SuperAdminController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('getDashboard', () => {
    it('should return dashboard stats successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'superadmin');
      const mockDashboardData = {
        organizations: {
          total: 10,
          pending: 2,
          approved: 7,
          rejected: 1,
          suspended: 0,
        },
        users: {
          total: 50,
          suspended: 3,
        },
        calls: {
          total_last_30_days: 150,
        },
        recent_organizations: [],
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockDashboardData),
      };
      (require('../../app/use-cases/super-admin/GetSuperAdminDashboardUseCase').GetSuperAdminDashboardUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.getDashboard(req, res);

      expect(res.json).toHaveBeenCalledWith(mockDashboardData);
    });

    it('should return 400 on error', async () => {
      res = createAuthenticatedResponse('user-id', 'superadmin');
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      (require('../../app/use-cases/super-admin/GetSuperAdminDashboardUseCase').GetSuperAdminDashboardUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.getDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'superadmin');
      const mockUsers = [
        {
          id: 'user-1',
          name: 'User 1',
          email: 'user1@example.com',
          is_verified_email: true,
          suspended_at: null,
          created_at: new Date(),
          user_type: 'user',
        },
      ];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockUsers),
      };
      (require('../../app/use-cases/super-admin/GetAllUsersUseCase').GetAllUsersUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 400 on error', async () => {
      res = createAuthenticatedResponse('user-id', 'superadmin');
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      (require('../../app/use-cases/super-admin/GetAllUsersUseCase').GetAllUsersUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getUserById', () => {
    it('should return user by id successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'superadmin');
      req.params = { id: 'user-1' };
      const mockUser = {
        id: 'user-1',
        name: 'User 1',
        email: 'user1@example.com',
        organizations: [],
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockUser),
      };
      (require('../../app/use-cases/super-admin/GetUserByIdUseCase').GetUserByIdUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 if user not found', async () => {
      res = createAuthenticatedResponse('user-id', 'superadmin');
      req.params = { id: 'invalid-id' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('User not found')),
      };
      (require('../../app/use-cases/super-admin/GetUserByIdUseCase').GetUserByIdUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });
  });

  describe('suspendUser', () => {
    it('should suspend user successfully', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'user-1' };
      const mockResult = {
        success: true,
        message: 'User suspended successfully',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockResult),
      };
      (require('../../app/use-cases/super-admin/SuspendUserUseCase').SuspendUserUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.suspendUser(req, res);

      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(mockUseCase.execute).toHaveBeenCalledWith('user-1', 'admin-id');
    });

    it('should return 400 if user not found', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'invalid-id' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('User not found')),
      };
      (require('../../app/use-cases/super-admin/SuspendUserUseCase').SuspendUserUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.suspendUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });
  });

  describe('activateUser', () => {
    it('should activate user successfully', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'user-1' };
      const mockResult = {
        success: true,
        message: 'User activated successfully',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockResult),
      };
      (require('../../app/use-cases/super-admin/ActivateUserUseCase').ActivateUserUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.activateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(mockUseCase.execute).toHaveBeenCalledWith('user-1', 'admin-id');
    });
  });

  describe('approveOrganization', () => {
    it('should approve organization successfully', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'org-1' };
      req.body = { internal_notes: 'Approved' };
      const mockResult = {
        success: true,
        message: 'Organization approved successfully',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockResult),
      };
      (require('../../app/use-cases/super-admin/ApproveOrganizationUseCase').ApproveOrganizationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.approveOrganization(req, res);

      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 if organization not found', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'invalid-id' };
      req.body = {};
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Organization not found')),
      };
      (require('../../app/use-cases/super-admin/ApproveOrganizationUseCase').ApproveOrganizationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.approveOrganization(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization not found',
      });
    });
  });

  describe('rejectOrganization', () => {
    it('should reject organization successfully', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'org-1' };
      req.body = { internal_notes: 'Rejected due to incomplete information' };
      const mockResult = {
        success: true,
        message: 'Organization rejected successfully',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockResult),
      };
      (require('../../app/use-cases/super-admin/RejectOrganizationUseCase').RejectOrganizationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.rejectOrganization(req, res);

      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('suspendOrganization', () => {
    it('should suspend organization successfully', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'org-1' };
      req.body = { internal_notes: 'Suspended due to violation' };
      const mockResult = {
        success: true,
        message: 'Organization suspended successfully',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockResult),
      };
      (require('../../app/use-cases/super-admin/SuspendOrganizationUseCase').SuspendOrganizationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.suspendOrganization(req, res);

      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('activateOrganization', () => {
    it('should activate organization successfully', async () => {
      res = createAuthenticatedResponse('admin-id', 'superadmin');
      req.params = { id: 'org-1' };
      req.body = {};
      const mockResult = {
        success: true,
        message: 'Organization activated successfully',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockResult),
      };
      (require('../../app/use-cases/super-admin/ActivateOrganizationUseCase').ActivateOrganizationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await SuperAdminController.activateOrganization(req, res);

      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });
});

