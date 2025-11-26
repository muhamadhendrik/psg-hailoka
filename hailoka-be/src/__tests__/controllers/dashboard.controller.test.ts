import { DashboardController } from '../../interfaces/dashboard.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/call.repository');
jest.mock('../../infrastructure/repositories/callParticipant.repository');
jest.mock('../../infrastructure/repositories/callEvent.repository');
jest.mock('../../infrastructure/repositories/organization.repository');
jest.mock('../../app/use-cases/dashboard/GetIncomingCallsUseCase');

describe('DashboardController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('getIncomingCalls', () => {
    it('should return incoming calls successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      const mockCalls = [
        {
          id: 'call-1',
          organization_id: 'org-1',
          join_code: 'abc-def-ghi',
          direction: 'inbound',
          created_at: new Date(),
          participants: [],
          events: [],
        },
      ];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockCalls),
      };
      (require('../../app/use-cases/dashboard/GetIncomingCallsUseCase').GetIncomingCallsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await DashboardController.getIncomingCalls(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCalls);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id');
    });

    it('should return 400 if organizationId is missing', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = {};

      await DashboardController.getIncomingCalls(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Organization ID is required',
      });
    });

    it('should return 400 if user not found in organization', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('User not found in organization')),
      };
      (require('../../app/use-cases/dashboard/GetIncomingCallsUseCase').GetIncomingCallsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await DashboardController.getIncomingCalls(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found in organization',
      });
    });

    it('should return 400 on error', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      (require('../../app/use-cases/dashboard/GetIncomingCallsUseCase').GetIncomingCallsUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await DashboardController.getIncomingCalls(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });
});

