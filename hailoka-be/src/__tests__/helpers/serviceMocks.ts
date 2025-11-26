// Service mocks for testing
export const createMockEmailService = () => ({
  sendWelcomeEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendEmail: jest.fn(),
});

export const createMockGoogleAuthService = () => ({
  loginOrRegisterGoogle: jest.fn(),
  verifyToken: jest.fn(),
});

