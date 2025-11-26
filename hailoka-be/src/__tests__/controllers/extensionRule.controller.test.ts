import { ExtensionRuleController } from '../../interfaces/extensionRule.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/extension-rule.repository');
jest.mock('../../app/use-cases/extension-rule/CreateExtensionRuleUseCase');
jest.mock('../../app/use-cases/extension-rule/GetAllExtensionRuleUseCase');
jest.mock('../../app/use-cases/extension-rule/GetExtensionRuleByIdUseCase');
jest.mock('../../app/use-cases/extension-rule/UpdateExtensionRuleUseCase');
jest.mock('../../app/use-cases/extension-rule/DeleteExtensionRuleUseCase');

describe('ExtensionRuleController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('insert', () => {
    it('should create extension rule successfully', async () => {
      req.body = {
        extension_id: 'ext-id',
        extension_destination: 'ext-dest-id',
      };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 'rule-id' },
        }),
      };
      (require('../../app/use-cases/extension-rule/CreateExtensionRuleUseCase').CreateExtensionRuleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionRuleController.insert(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'rule-id' },
      });
    });

    it('should return 401 if not authenticated', async () => {
      req.body = { extension_id: 'ext-id' };
      res = createMockResponse();

      await ExtensionRuleController.insert(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing authentication',
      });
    });
  });

  describe('getAll', () => {
    it('should return all extension rules', async () => {
      req.params = { orgId: 'org-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue([
          { id: 'rule-1', extension_id: 'ext-1' },
        ]),
      };
      (require('../../app/use-cases/extension-rule/GetAllExtensionRuleUseCase').GetAllExtensionRuleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionRuleController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 'rule-1', extension_id: 'ext-1' },
      ]);
    });
  });

  describe('getById', () => {
    it('should return extension rule by id', async () => {
      req.params = { id: 'rule-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: 'rule-id',
          extension_id: 'ext-1',
        }),
      };
      (require('../../app/use-cases/extension-rule/GetExtensionRuleByIdUseCase').GetExtensionRuleByIdUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionRuleController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 'rule-id',
        extension_id: 'ext-1',
      });
    });

    it('should return 404 if rule not found', async () => {
      req.params = { id: 'rule-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(null),
      };
      (require('../../app/use-cases/extension-rule/GetExtensionRuleByIdUseCase').GetExtensionRuleByIdUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionRuleController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Extension rule not found',
      });
    });
  });

  describe('update', () => {
    it('should update extension rule successfully', async () => {
      req.params = { id: 'rule-id' };
      req.body = { extension_destination: 'new-ext-dest' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 'rule-id' },
        }),
      };
      (require('../../app/use-cases/extension-rule/UpdateExtensionRuleUseCase').UpdateExtensionRuleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionRuleController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'rule-id' },
      });
    });
  });

  describe('delete', () => {
    it('should delete extension rule successfully', async () => {
      req.params = { id: 'rule-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
        }),
      };
      (require('../../app/use-cases/extension-rule/DeleteExtensionRuleUseCase').DeleteExtensionRuleUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await ExtensionRuleController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
      });
    });

    it('should return 401 if not authenticated', async () => {
      req.params = { id: 'rule-id' };
      res = createMockResponse();

      await ExtensionRuleController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing authentication',
      });
    });
  });
});

