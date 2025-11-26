import { CallController } from '../../interfaces/call.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/call.repository');
jest.mock('../../infrastructure/repositories/callStaffAvailibility.repository');
jest.mock('../../infrastructure/repositories/callParticipant.repository');
jest.mock('../../infrastructure/repositories/callEvent.repository');
jest.mock('../../infrastructure/repositories/callFeedback.repository');
jest.mock('../../infrastructure/repositories/organization.repository');
jest.mock('../../app/use-cases/call/createCallRequest');
jest.mock('../../app/use-cases/call/CreateCallFeedbackUseCase');
jest.mock('../../app/use-cases/call/GetCallFeedbacksUseCase');
jest.mock('../../app/use-cases/call/AddCallParticipantUseCase');
jest.mock('../../app/use-cases/call/AddCallEventUseCase');

describe('CallController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('insert', () => {
    it('should create call successfully', async () => {
      req.body = {
        extension_id: 'ext-id',
        caller_id: 'caller-id',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 'call-id' },
        }),
      };
      (require('../../app/use-cases/call/createCallRequest').CreateCallUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.insert(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'test create call',
      });
    });
  });

  describe('createFeedback', () => {
    it('should create call feedback successfully', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        kind: 'USER',
        ref_id: '123e4567-e89b-12d3-a456-426614174001',
        score: 5,
        feedback: 'Great service!',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: 'feedback-123',
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          kind: 'USER',
          ref_id: '123e4567-e89b-12d3-a456-426614174001',
          score: 5,
          feedback: 'Great service!',
          created_at: new Date(),
          updated_at: new Date(),
        }),
      };
      (require('../../app/use-cases/call/CreateCallFeedbackUseCase').CreateCallFeedbackUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.createFeedback(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'feedback-123',
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          score: 5,
        })
      );
    });

    it('should return 400 if validation fails', async () => {
      req.body = {
        call_id: 'invalid',
        kind: 'INVALID',
        ref_id: 'user-123',
        score: 10, // Invalid: score > 5
      };

      await CallController.createFeedback(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it('should return 400 if call not found', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        kind: 'USER',
        ref_id: '123e4567-e89b-12d3-a456-426614174001',
        score: 5,
      };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Call not found')),
      };
      (require('../../app/use-cases/call/CreateCallFeedbackUseCase').CreateCallFeedbackUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.createFeedback(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Call not found',
      });
    });
  });

  describe('getFeedbacks', () => {
    it('should return call feedbacks for organization successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1' };
      req.query = { page: '1', limit: '50' };
      const mockFeedbacks = [
        {
          id: 'feedback-1',
          call_id: 'call-1',
          kind: 'USER',
          ref_id: 'user-1',
          score: 5,
          feedback: 'Great!',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockFeedbacks),
      };
      (require('../../app/use-cases/call/GetCallFeedbacksUseCase').GetCallFeedbacksUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.getFeedbacks(req, res);

      expect(res.json).toHaveBeenCalledWith(mockFeedbacks);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id', undefined, 1, 50);
    });

    it('should return call feedbacks for specific call successfully', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1', callId: 'call-1' };
      req.query = { page: '1', limit: '50' };
      const mockFeedbacks = [
        {
          id: 'feedback-1',
          call_id: 'call-1',
          kind: 'USER',
          ref_id: 'user-1',
          score: 5,
          feedback: 'Great!',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(mockFeedbacks),
      };
      (require('../../app/use-cases/call/GetCallFeedbacksUseCase').GetCallFeedbacksUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.getFeedbacks(req, res);

      expect(res.json).toHaveBeenCalledWith(mockFeedbacks);
      expect(mockUseCase.execute).toHaveBeenCalledWith('org-1', 'user-id', 'call-1', 1, 50);
    });

    it('should return 400 if organizationId is missing', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = {};
      req.query = { page: '1', limit: '50' };

      await CallController.getFeedbacks(req, res);

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
      (require('../../app/use-cases/call/GetCallFeedbacksUseCase').GetCallFeedbacksUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.getFeedbacks(req, res);

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
      (require('../../app/use-cases/call/GetCallFeedbacksUseCase').GetCallFeedbacksUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.getFeedbacks(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User does not have access to this organization',
      });
    });

    it('should return 400 if call does not belong to organization', async () => {
      res = createAuthenticatedResponse('user-id', 'user');
      req.params = { organizationId: 'org-1', callId: 'call-1' };
      req.query = { page: '1', limit: '50' };
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Call does not belong to this organization')),
      };
      (require('../../app/use-cases/call/GetCallFeedbacksUseCase').GetCallFeedbacksUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.getFeedbacks(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Call does not belong to this organization',
      });
    });
  });

  describe('addParticipant', () => {
    it('should add participant to call successfully', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        role: 'recipient',
        kind: 'user',
        ref_id: '123e4567-e89b-12d3-a456-426614174001',
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: 1,
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          role: 'recipient',
          kind: 'user',
          ref_id: '123e4567-e89b-12d3-a456-426614174001',
          created_at: new Date(),
        }),
      };
      (require('../../app/use-cases/call/AddCallParticipantUseCase').AddCallParticipantUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.addParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          role: 'recipient',
          kind: 'user',
        })
      );
    });

    it('should return 400 if validation fails', async () => {
      req.body = {
        call_id: 'invalid',
        role: 'invalid',
        kind: 'invalid',
        ref_id: 'invalid',
      };

      await CallController.addParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it('should return 400 if call not found', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        role: 'recipient',
        kind: 'user',
        ref_id: '123e4567-e89b-12d3-a456-426614174001',
      };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Call not found')),
      };
      (require('../../app/use-cases/call/AddCallParticipantUseCase').AddCallParticipantUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.addParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Call not found',
      });
    });
  });

  describe('addEvent', () => {
    it('should add event to call successfully', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        call_participant_id: 1,
        attempt_count: 1,
        event_type: 'answered',
        queue_count: 0,
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: 1,
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          call_participant_id: 1,
          attempt_count: 1,
          event_type: 'answered',
          queue_count: 0,
          created_at: new Date(),
        }),
      };
      (require('../../app/use-cases/call/AddCallEventUseCase').AddCallEventUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          event_type: 'answered',
        })
      );
    });

    it('should add event without participant successfully', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        event_type: 'ended',
        queue_count: 0,
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: 1,
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          call_participant_id: null,
          attempt_count: 0,
          event_type: 'ended',
          queue_count: 0,
          created_at: new Date(),
        }),
      };
      (require('../../app/use-cases/call/AddCallEventUseCase').AddCallEventUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: 'ended',
        })
      );
    });

    it('should add queue event successfully', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        event_type: 'queued',
        queue_count: 2,
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: 1,
          call_id: '123e4567-e89b-12d3-a456-426614174000',
          call_participant_id: null,
          attempt_count: 0,
          event_type: 'queued',
          queue_count: 2,
          created_at: new Date(),
        }),
      };
      (require('../../app/use-cases/call/AddCallEventUseCase').AddCallEventUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: 'queued',
          queue_count: 2,
        })
      );
    });

    it('should return 400 if validation fails', async () => {
      req.body = {
        call_id: 'invalid',
        event_type: 'invalid_event',
      };

      await CallController.addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it('should return 400 if call not found', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        event_type: 'answered',
      };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Call not found')),
      };
      (require('../../app/use-cases/call/AddCallEventUseCase').AddCallEventUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Call not found',
      });
    });

    it('should return 400 if participant not found', async () => {
      req.body = {
        call_id: '123e4567-e89b-12d3-a456-426614174000',
        call_participant_id: 999,
        event_type: 'answered',
      };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Call participant not found or does not belong to this call')),
      };
      (require('../../app/use-cases/call/AddCallEventUseCase').AddCallEventUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await CallController.addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Call participant not found or does not belong to this call',
      });
    });
  });
});

