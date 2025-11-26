import { Request, Response, NextFunction } from 'express';
import { superAdminMiddleware } from '../../interfaces/middlewares/superadmin.middleware';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mockFactory';

describe('superAdminMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  it('should call next() for superadmin user', () => {
    res = createMockResponse();
    res.locals = {
      user_type: 'superadmin',
      user_id: 'admin-id',
    };

    superAdminMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 403 for non-superadmin user', () => {
    res = createMockResponse();
    res.locals = {
      user_type: 'user',
      user_id: 'user-id',
    };

    superAdminMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: Super admin access required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 for guest user', () => {
    res = createMockResponse();
    res.locals = {
      user_type: 'guest',
      user_id: 'guest-id',
    };

    superAdminMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: Super admin access required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user_type is undefined', () => {
    res = createMockResponse();
    res.locals = {
      user_id: 'user-id',
    };

    superAdminMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: Super admin access required',
    });
    expect(next).not.toHaveBeenCalled();
  });
});

