import { ExtensionController } from '../../interfaces/extension.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/extension.repository');
jest.mock('../../infrastructure/repositories/extension-operational.repository');
jest.mock('../../infrastructure/repositories/extension-staff.repository');
jest.mock('../../app/use-cases/extension/insertExtensionUsecase');
jest.mock('../../app/use-cases/extension/updateExtensionUsecase');
jest.mock('../../app/use-cases/extension/deleteExtensionUsecase');
jest.mock('../../app/use-cases/extension/getExtensionByOrganization');
jest.mock('../../app/use-cases/extension/getExtensionByExtId');
jest.mock('../../app/use-cases/extension/getSelectExtensionByOrg');
jest.mock('../../app/use-cases/extension/GetExtensionConfigurationUseCase');
jest.mock('../../app/use-cases/extension/UpdateExtensionConfigurationUseCase');
jest.mock('../../infrastructure/repositories/organization.repository');

describe('ExtensionController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('insert', () => {
    it('should insert extension successfully', async () => {
      req.body = {
        name: 'Extension 1',
        organization_id: 'org-id',
      };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 'ext-id' },
        }),
      };
      (require('../../app/use-cases/extension/insertExtensionUsecase').InsertExtensionUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.insert(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'ext-id' },
      });
    });

    it('should return 401 if not authenticated', async () => {
      req.body = { name: 'Extension 1' };
      res = createMockResponse();

      await ExtensionController.insert(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing authentication',
      });
    });
  });

  describe('update', () => {
    it('should update extension successfully', async () => {
      req.params = { extId: 'ext-id' };
      req.body = { name: 'Updated Extension' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 'ext-id', name: 'Updated Extension' },
        }),
      };
      (require('../../app/use-cases/extension/updateExtensionUsecase').UpdateExtensionUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'ext-id', name: 'Updated Extension' },
      });
    });
  });

  describe('getByOrgId', () => {
    it('should return extensions by organization', async () => {
      req.params = { organizationId: 'org-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue([
          { id: 'ext-1', name: 'Extension 1' },
        ]),
      };
      (require('../../app/use-cases/extension/getExtensionByOrganization').GetExtensionByOrganization as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.getByOrgId(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { id: 'ext-1', name: 'Extension 1' },
      ]);
    });
  });

  describe('delete', () => {
    it('should delete extension successfully', async () => {
      req.params = { extId: 'ext-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ success: true }),
      };
      (require('../../app/use-cases/extension/deleteExtensionUsecase').DeleteExtensionUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
      });
    });
  });

  describe('getExtensionConfiguration', () => {
    it('should return extension configuration successfully', async () => {
      req.params = { organizationId: 'org-id' };
      res = createAuthenticatedResponse();

      const mockConfiguration = {
        ring_timeout_seconds: 60,
        max_concurrent_calls: 1,
        is_record_a_call: false,
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockConfiguration),
      };
      (require('../../app/use-cases/extension/GetExtensionConfigurationUseCase').GetExtensionConfigurationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.getExtensionConfiguration(req, res);

      expect(res.json).toHaveBeenCalledWith(mockConfiguration);
    });

    it('should return 401 if not authenticated', async () => {
      req.params = { organizationId: 'org-id' };
      res = createMockResponse();

      await ExtensionController.getExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing authentication',
      });
    });

    it('should return 400 if organization ID is missing', async () => {
      req.params = {};
      res = createAuthenticatedResponse();

      await ExtensionController.getExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization ID is required',
      });
    });

    it('should return 400 if organization not found', async () => {
      req.params = { organizationId: 'org-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Organization not found')),
      };
      (require('../../app/use-cases/extension/GetExtensionConfigurationUseCase').GetExtensionConfigurationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.getExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization not found',
      });
    });

    it('should return default values if settings do not exist', async () => {
      req.params = { organizationId: 'org-id' };
      res = createAuthenticatedResponse();

      const mockConfiguration = {
        ring_timeout_seconds: 60,
        max_concurrent_calls: 1,
        is_record_a_call: false,
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockConfiguration),
      };
      (require('../../app/use-cases/extension/GetExtensionConfigurationUseCase').GetExtensionConfigurationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.getExtensionConfiguration(req, res);

      expect(res.json).toHaveBeenCalledWith(mockConfiguration);
    });
  });

  describe('updateExtensionConfiguration', () => {
    it('should update extension configuration successfully', async () => {
      req.params = { organizationId: 'org-id' };
      req.body = {
        ring_timeout_seconds: 90,
        max_concurrent_calls: 5,
        is_record_a_call: true,
      };
      res = createAuthenticatedResponse();

      const mockUpdatedConfiguration = {
        ring_timeout_seconds: 90,
        max_concurrent_calls: 5,
        is_record_a_call: true,
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockUpdatedConfiguration),
      };
      (require('../../app/use-cases/extension/UpdateExtensionConfigurationUseCase').UpdateExtensionConfigurationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.updateExtensionConfiguration(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUpdatedConfiguration);
    });

    it('should update extension configuration with partial data', async () => {
      req.params = { organizationId: 'org-id' };
      req.body = {
        ring_timeout_seconds: 120,
      };
      res = createAuthenticatedResponse();

      const mockUpdatedConfiguration = {
        ring_timeout_seconds: 120,
        max_concurrent_calls: 1,
        is_record_a_call: false,
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockUpdatedConfiguration),
      };
      (require('../../app/use-cases/extension/UpdateExtensionConfigurationUseCase').UpdateExtensionConfigurationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.updateExtensionConfiguration(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUpdatedConfiguration);
    });

    it('should return 401 if not authenticated', async () => {
      req.params = { organizationId: 'org-id' };
      req.body = { ring_timeout_seconds: 90 };
      res = createMockResponse();

      await ExtensionController.updateExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing authentication',
      });
    });

    it('should return 400 if organization ID is missing', async () => {
      req.params = {};
      req.body = { ring_timeout_seconds: 90 };
      res = createAuthenticatedResponse();

      await ExtensionController.updateExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization ID is required',
      });
    });

    it('should return 400 if validation fails', async () => {
      req.params = { organizationId: 'org-id' };
      req.body = {
        ring_timeout_seconds: -1, // Invalid: must be >= 1
      };
      res = createAuthenticatedResponse();

      await ExtensionController.updateExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it('should return 400 if only owner can update', async () => {
      req.params = { organizationId: 'org-id' };
      req.body = { ring_timeout_seconds: 90 };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Only owner can update extension configuration')),
      };
      (require('../../app/use-cases/extension/UpdateExtensionConfigurationUseCase').UpdateExtensionConfigurationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.updateExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Only owner can update extension configuration',
      });
    });

    it('should return 400 if organization not found', async () => {
      req.params = { organizationId: 'invalid-org-id' };
      req.body = { ring_timeout_seconds: 90 };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Organization not found')),
      };
      (require('../../app/use-cases/extension/UpdateExtensionConfigurationUseCase').UpdateExtensionConfigurationUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionController.updateExtensionConfiguration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization not found',
      });
    });
  });
});

