import { OrganizationController } from '../../interfaces/organization.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse } from '../helpers/mockFactory';

// Mock dependencies at module level - create mock object inside factory to avoid hoisting issues
let mockOrgRepoMethods: any;

jest.mock('../../infrastructure/repositories/organization.repository', () => {
  // Create mock methods inside the factory
  const mockMethods = {
    findAll: jest.fn(),
    findOrganizationsByUserId: jest.fn(),
  };
  // Export for use in tests
  (global as any).__mockOrgRepoMethods = mockMethods;
  return {
    OrganizationRepository: jest.fn().mockImplementation(() => mockMethods),
  };
});

jest.mock('../../infrastructure/repositories/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  })),
}));

jest.mock('../../infrastructure/mailer/nodemailer.service', () => ({
  NodemailerService: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn(),
  })),
}));

jest.mock('../../app/use-cases/organization/CreateOrganizationUseCase');
jest.mock('../../app/use-cases/organization/GetOrganizationSettingsUseCase');
jest.mock('../../app/use-cases/organization/UpdateOrganizationSettingsUseCase');
jest.mock('../../app/use-cases/organization/GetOrganizationChangeLogsUseCase');
jest.mock('../../app/use-cases/organization/GetOrganizationUserLogsUseCase');
jest.mock('../../infrastructure/repositories/organizationChangeLog.repository', () => ({
  OrganizationChangeLogRepository: jest.fn().mockImplementation(() => ({
    findByOrganizationId: jest.fn(),
  })),
}));
jest.mock('../../infrastructure/repositories/organizationUserLog.repository', () => ({
  OrganizationUserLogRepository: jest.fn().mockImplementation(() => ({
    findByUserId: jest.fn(),
    findByOrganizationId: jest.fn(),
  })),
}));

describe('OrganizationController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('create', () => {
    it('should create organization successfully', async () => {
      req.body = {
        name: 'Test Organization',
      };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: 'org-id',
          name: 'Test Organization',
          organizationStatusId: 1,
        }),
      };
      (require('../../app/use-cases/organization/CreateOrganizationUseCase').CreateOrganizationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 'org-id',
        name: 'Test Organization',
        status_id: 1,
      });
    });

    it('should return 401 if not authenticated', async () => {
      req.body = { name: 'Test Organization' };
      res = createMockResponse();

      await OrganizationController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
      });
    });

    it('should return 400 if validation fails', async () => {
      req.body = { name: '' };
      res = createAuthenticatedResponse();

      await OrganizationController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe('getAll', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Get reference to mock methods
      mockOrgRepoMethods = (global as any).__mockOrgRepoMethods;
    });

    it('should return all organizations for superadmin', async () => {
      res = createAuthenticatedResponse('user-id', 'superadmin');
      mockOrgRepoMethods.findAll.mockResolvedValue([
        { id: 'org-1', name: 'Org 1' },
        { id: 'org-2', name: 'Org 2' },
      ]);

      // Re-import controller to get new instances with mocked repo
      delete require.cache[require.resolve('../../interfaces/organization.controller')];
      const { OrganizationController: OrgControllerNew } = require('../../interfaces/organization.controller');

      await OrgControllerNew.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { id: 'org-1', name: 'Org 1' },
        { id: 'org-2', name: 'Org 2' },
      ]);
    });

    it('should return user organizations for regular user', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      mockOrgRepoMethods.findOrganizationsByUserId.mockResolvedValue([
        { id: 'org-1', name: 'Org 1' },
      ]);

      // Re-import controller to get new instances with mocked repo
      delete require.cache[require.resolve('../../interfaces/organization.controller')];
      const { OrganizationController: OrgControllerNew } = require('../../interfaces/organization.controller');

      await OrgControllerNew.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { id: 'org-1', name: 'Org 1' },
      ]);
    });

    it('should return 403 for invalid user type', async () => {
      res = createAuthenticatedResponse('user-id', 'guest');

      await OrganizationController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Forbidden',
      });
    });
  });

  describe('getSettings', () => {
    it('should return organization settings successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      const mockSettings = {
        organization: {
          id: 'org-1',
          name: 'Test Organization',
          organization_status_id: 1,
        },
        extension_settings: {
          ring_timeout_seconds: 60,
          is_record_a_call: false,
        },
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockSettings),
      };
      (require('../../app/use-cases/organization/GetOrganizationSettingsUseCase').GetOrganizationSettingsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getSettings(req, res);

      expect(res.json).toHaveBeenCalledWith(mockSettings);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id');
    });

    it('should return 400 if organizationId is missing', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = {};

      await OrganizationController.getSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization ID is required',
      });
    });

    it('should return 400 if user is not owner', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Only owner can access organization settings')),
      };
      (require('../../app/use-cases/organization/GetOrganizationSettingsUseCase').GetOrganizationSettingsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Only owner can access organization settings',
      });
    });

    it('should return 400 if organization not found', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'invalid-id' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Organization not found')),
      };
      (require('../../app/use-cases/organization/GetOrganizationSettingsUseCase').GetOrganizationSettingsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization not found',
      });
    });
  });

  describe('updateSettings', () => {
    it('should update organization settings successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.body = {
        name: 'Updated Organization Name',
        ring_timeout_seconds: 90,
        is_record_a_call: true,
      };
      const mockResult = {
        success: true,
        message: 'Organization settings updated successfully',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockResult),
      };
      (require('../../app/use-cases/organization/UpdateOrganizationSettingsUseCase').UpdateOrganizationSettingsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.updateSettings(req, res);

      expect(res.json).toHaveBeenCalledWith(mockResult);
      // Check that execute was called with correct params (body may be transformed by DTO)
      expect(mockUseCase.execute).toHaveBeenCalledWith(
        'org-1',
        'user-id',
        expect.objectContaining({
          name: 'Updated Organization Name',
        })
      );
    });

    it('should return 400 if organizationId is missing', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = {};
      req.body = { name: 'Updated Name' };

      await OrganizationController.updateSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization ID is required',
      });
    });

    it('should return 400 if user is not owner', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.body = { name: 'Updated Name' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Only owner can update organization settings')),
      };
      (require('../../app/use-cases/organization/UpdateOrganizationSettingsUseCase').UpdateOrganizationSettingsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.updateSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Only owner can update organization settings',
      });
    });

    it('should return 400 if validation fails', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.body = { name: '' }; // Invalid: name too short

      await OrganizationController.updateSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe('getChangeLogs', () => {
    it('should return organization change logs successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.query = { page: '1', limit: '50' };
      const mockChangeLogs = [
        {
          id: 1,
          organization_id: 'org-1',
          old_data: null,
          new_data: { name: 'Test Organization' },
          user_id: 'user-id',
          created_at: new Date(),
        },
        {
          id: 2,
          organization_id: 'org-1',
          old_data: { name: 'Test Organization' },
          new_data: { name: 'Updated Organization' },
          user_id: 'user-id',
          created_at: new Date(),
        },
      ];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockChangeLogs),
      };
      (require('../../app/use-cases/organization/GetOrganizationChangeLogsUseCase').GetOrganizationChangeLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getChangeLogs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockChangeLogs);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id', 1, 50);
    });

    it('should use default pagination if not provided', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.query = {};
      const mockChangeLogs = [];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockChangeLogs),
      };
      (require('../../app/use-cases/organization/GetOrganizationChangeLogsUseCase').GetOrganizationChangeLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getChangeLogs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockChangeLogs);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id', 1, 50);
    });

    it('should return 400 if organizationId is missing', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = {};
      req.query = { page: '1', limit: '50' };

      await OrganizationController.getChangeLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization ID is required',
      });
    });

    it('should return 400 if organization not found', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'invalid-id' };
      req.query = { page: '1', limit: '50' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Organization not found')),
      };
      (require('../../app/use-cases/organization/GetOrganizationChangeLogsUseCase').GetOrganizationChangeLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getChangeLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization not found',
      });
    });

    it('should return 400 if user does not have access', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.query = { page: '1', limit: '50' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('User does not have access to this organization')),
      };
      (require('../../app/use-cases/organization/GetOrganizationChangeLogsUseCase').GetOrganizationChangeLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getChangeLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User does not have access to this organization',
      });
    });
  });

  describe('getUserLogs', () => {
    it('should return organization user logs for all users successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.query = { page: '1', limit: '50' };
      const mockUserLogs = [
        {
          id: 1,
          extension_id: 'ext-1',
          user_id: 'target-user-id',
          old_data: { role_id: 4 },
          new_data: { role_id: 1 },
          created_by: 'user-id',
          created_at: new Date(),
        },
      ];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockUserLogs),
      };
      (require('../../app/use-cases/organization/GetOrganizationUserLogsUseCase').GetOrganizationUserLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getUserLogs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUserLogs);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id', undefined, 1, 50);
    });

    it('should return organization user logs for specific user successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1', userId: 'target-user-id' };
      req.query = { page: '1', limit: '50' };
      const mockUserLogs = [
        {
          id: 1,
          extension_id: 'ext-1',
          user_id: 'target-user-id',
          old_data: { role_id: 4 },
          new_data: { role_id: 1 },
          created_by: 'user-id',
          created_at: new Date(),
        },
      ];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockUserLogs),
      };
      (require('../../app/use-cases/organization/GetOrganizationUserLogsUseCase').GetOrganizationUserLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getUserLogs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUserLogs);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id', 'target-user-id', 1, 50);
    });

    it('should use default pagination if not provided', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.query = {};
      const mockUserLogs = [];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockUserLogs),
      };
      (require('../../app/use-cases/organization/GetOrganizationUserLogsUseCase').GetOrganizationUserLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getUserLogs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUserLogs);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id', undefined, 1, 50);
    });

    it('should return 400 if organizationId is missing', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = {};
      req.query = { page: '1', limit: '50' };

      await OrganizationController.getUserLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization ID is required',
      });
    });

    it('should return 400 if organization not found', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'invalid-id' };
      req.query = { page: '1', limit: '50' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Organization not found')),
      };
      (require('../../app/use-cases/organization/GetOrganizationUserLogsUseCase').GetOrganizationUserLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getUserLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization not found',
      });
    });

    it('should return 400 if user does not have access', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.query = { page: '1', limit: '50' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('User does not have access to this organization')),
      };
      (require('../../app/use-cases/organization/GetOrganizationUserLogsUseCase').GetOrganizationUserLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getUserLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User does not have access to this organization',
      });
    });

    it('should return 400 if target user not found in organization', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1', userId: 'invalid-user-id' };
      req.query = { page: '1', limit: '50' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Target user not found in organization')),
      };
      (require('../../app/use-cases/organization/GetOrganizationUserLogsUseCase').GetOrganizationUserLogsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await OrganizationController.getUserLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Target user not found in organization',
      });
    });
  });
});

