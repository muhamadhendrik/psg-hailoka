import { UserController } from '../../interfaces/user.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse, mockUser } from '../helpers/mockFactory';
import { createMockUserRepository } from '../helpers/repositoryMocks';
import { createMockEmailService } from '../helpers/serviceMocks';

// Mock dependencies at module level
jest.mock('../../infrastructure/repositories/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
    findByEmail: jest.fn(),
  })),
}));

const mockSendWelcomeEmail = jest.fn();

jest.mock('../../infrastructure/mailer/nodemailer.service', () => ({
  NodemailerService: jest.fn().mockImplementation(() => ({
    sendWelcomeEmail: jest.fn(),
  })),
}));

jest.mock('../../app/use-cases/email/send-welcome-email.usecase', () => {
  const mockExecute = jest.fn();
  return {
    SendWelcomeEmailUseCase: jest.fn().mockImplementation(() => ({
      execute: mockExecute,
    })),
    __mockExecute: mockExecute, // Export mock function for test access
  };
});

describe('UserController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('me', () => {
    it('should return user data when authenticated', async () => {
      res = createAuthenticatedResponse();

      const mockUserRepo = createMockUserRepository();
      mockUserRepo.findById.mockResolvedValue(mockUser);
      (require('../../infrastructure/repositories/user.repository').UserRepository as jest.Mock) = jest.fn(() => mockUserRepo);

      await UserController.me(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        user_type: 'user',
      });
    });

    it('should return 401 if not authenticated', async () => {
      res = createMockResponse();

      await UserController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
      });
    });

    it('should return 404 if user not found', async () => {
      res = createAuthenticatedResponse();

      const mockUserRepo = createMockUserRepository();
      mockUserRepo.findById.mockResolvedValue(null);
      (require('../../infrastructure/repositories/user.repository').UserRepository as jest.Mock) = jest.fn(() => mockUserRepo);

      await UserController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });
  });

  describe('testEmail', () => {
    let mockExecute: jest.Mock;

    beforeEach(() => {
      const SendWelcomeEmailUseCaseModule = require('../../app/use-cases/email/send-welcome-email.usecase');
      mockExecute = SendWelcomeEmailUseCaseModule.__mockExecute;
      mockExecute.mockClear();
    });

    it('should send test email successfully', async () => {
      req.body = {
        email: 'test@example.com',
        name: 'Test User',
      };

      mockExecute.mockResolvedValue(undefined);

      // Re-import controller to get new instance with mocked use case
      delete require.cache[require.resolve('../../interfaces/user.controller')];
      const { UserController: UserControllerNew } = require('../../interfaces/user.controller');

      await UserControllerNew.testEmail(req, res);

      expect(mockExecute).toHaveBeenCalledWith('test@example.com', 'Test User');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test email sent successfully!',
      });
    });

    it('should return 500 if email sending fails', async () => {
      req.body = {
        email: 'test@example.com',
        name: 'Test User',
      };

      mockExecute.mockRejectedValue(new Error('Email service error'));

      // Re-import controller to get new instance with mocked use case
      delete require.cache[require.resolve('../../interfaces/user.controller')];
      const { UserController: UserControllerNew } = require('../../interfaces/user.controller');

      await UserControllerNew.testEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to send test email',
      });
    });
  });
});

