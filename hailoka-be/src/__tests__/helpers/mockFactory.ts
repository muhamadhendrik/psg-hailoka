import { Request, Response } from 'express';
import { User } from '../../domain/user';
import { Role } from '../../domain/role';

// Mock Request factory
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
  return {
    body: {},
    params: {},
    query: {},
    cookies: {},
    headers: {},
    ...overrides,
  } as Partial<Request>;
};

// Mock Response factory
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    locals: {},
  };
  return res;
};

// Mock NextFunction
export const createMockNext = () => jest.fn();

// Mock User data
export const mockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test User',
  email: 'test@example.com',
  picturePath: null,
  isVerifiedEmail: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  suspendedAt: null,
  deletedAt: null,
  userType: 'user',
};

// Mock Role data
export const mockRole: Role = {
  id: 1,
  name: 'admin',
};

// Mock authenticated request
export const createAuthenticatedRequest = (userId: string = mockUser.id, userType: string = 'user') => {
  return createMockRequest({
    cookies: { token: 'mock-token' },
  });
};

// Mock authenticated response with locals
export const createAuthenticatedResponse = (userId: string = mockUser.id, userType: string = 'user') => {
  const res = createMockResponse();
  res.locals = {
    user_id: userId,
    user_email: mockUser.email,
    user_type: userType,
  };
  return res;
};

