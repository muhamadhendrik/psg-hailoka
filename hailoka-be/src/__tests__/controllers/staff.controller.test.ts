import { StaffController } from '../../interfaces/staff.controller';
import { createMockRequest, createMockResponse, createAuthenticatedResponse } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/organization.repository');
jest.mock('../../infrastructure/repositories/user.repository');
jest.mock('../../infrastructure/repositories/callStaffAvailibility.repository');
jest.mock('../../app/use-cases/staff/createStaffUsecase');
jest.mock('../../app/use-cases/staff/editStaffUsecase');
jest.mock('../../app/use-cases/staff/getStaffByOrganization');
jest.mock('../../app/use-cases/staff/deleteStaffUsecase');
jest.mock('../../app/use-cases/staff/getStaffByUserId');
jest.mock('../../app/use-cases/staff/getStaffSelectionUseCase');

describe('StaffController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('create', () => {
    it('should create staff successfully', async () => {
      req.body = {
        name: 'Staff Name',
        email: 'staff@example.com',
        roleId: 1,
        organizationId: 'org-id',
      };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 'staff-id' },
        }),
      };
      (require('../../app/use-cases/staff/createStaffUsecase').CreateStaffUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await StaffController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'staff-id' },
      });
    });

    it('should return 400 if validation fails', async () => {
      req.body = {};
      res = createAuthenticatedResponse();

      await StaffController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe('edit', () => {
    it('should edit staff successfully', async () => {
      req.body = {
        userId: 'user-id',
        name: 'Updated Name',
        roleId: 2,
      };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 'staff-id' },
        }),
      };
      (require('../../app/use-cases/staff/editStaffUsecase').EditStaffUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await StaffController.edit(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'staff-id' },
      });
    });
  });

  describe('getStaffsByOrganization', () => {
    it('should return staffs by organization', async () => {
      req.params = { organizationId: 'org-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue([
          { id: 'staff-1', name: 'Staff 1' },
        ]),
      };
      (require('../../app/use-cases/staff/getStaffByOrganization').GetStaffByOrganizationUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await StaffController.getStaffsByOrganization(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { id: 'staff-1', name: 'Staff 1' },
      ]);
    });
  });

  describe('delete', () => {
    it('should delete staff successfully', async () => {
      req.params = { userId: 'user-id' };
      res = createAuthenticatedResponse();

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ success: true }),
      };
      (require('../../app/use-cases/staff/deleteStaffUsecase').DeleteStaffUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await StaffController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
      });
    });
  });
});

