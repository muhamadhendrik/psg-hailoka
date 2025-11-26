import { QrOrganizationController } from '../../interfaces/qrOrganization.controller';
import { createMockRequest, createMockResponse } from '../helpers/mockFactory';

// Mock dependencies
jest.mock('../../infrastructure/repositories/org-code-qr.repository');
jest.mock('../../app/use-cases/qrcode/createGenerateQr');
jest.mock('../../app/use-cases/qrcode/getQrUrlUsecase');
jest.mock('../../app/use-cases/qrcode/getQrByOrgUseCase');
jest.mock('qrcode');

describe('QrOrganizationController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('getByOrgId', () => {
    it('should return QR by organization id', async () => {
      req.params = { organizationId: 'org-id' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { qr_url: 'qr-url-123' },
        }),
      };
      (require('../../app/use-cases/qrcode/getQrByOrgUseCase').GetQrByOrgUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await QrOrganizationController.getByOrgId(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { qr_url: 'qr-url-123' },
      });
    });

    it('should return 400 on error', async () => {
      req.params = { organizationId: 'org-id' };

      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Not found')),
      };
      (require('../../app/use-cases/qrcode/getQrByOrgUseCase').GetQrByOrgUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await QrOrganizationController.getByOrgId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Not found',
      });
    });
  });

  describe('generateQr', () => {
    it('should generate QR successfully', async () => {
      req.body = {
        organization_id: 'org-id',
        data: { key: 'value' },
      };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { qr_url: 'qr-url-123' },
        }),
      };
      (require('../../app/use-cases/qrcode/createGenerateQr').CreateGenerateQrUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await QrOrganizationController.generateQr(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { qr_url: 'qr-url-123' },
      });
    });

    it('should return 400 if organization_id is missing', async () => {
      req.body = { data: { key: 'value' } };

      await QrOrganizationController.generateQr(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'organization_id is required',
      });
    });
  });

  describe('getByQrUrl', () => {
    it('should return QR data by URL', async () => {
      req.params = { qrUrl: 'qr-url-123' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          data: { data_json: '{"key":"value"}' },
          token: 'mock-token',
        }),
      };
      (require('../../app/use-cases/qrcode/getQrUrlUsecase').GetQrUrlUsecase as jest.Mock) = jest.fn(() => mockUseCase);

      await QrOrganizationController.getByQrUrl(req, res);

      expect(res.cookie).toHaveBeenCalledWith('tokenOrganizationIndentity', 'mock-token', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({
        data: '{"key":"value"}',
      });
    });

    it('should return 400 if qrUrl is missing', async () => {
      req.params = { qrUrl: '' };

      await QrOrganizationController.getByQrUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'qrUrl parameter is required',
      });
    });
  });

  describe('generateQrImage', () => {
    it('should generate QR image successfully', async () => {
      req.params = { organizationId: 'org-id' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { qr_url: 'qr-url-123' },
        }),
      };
      const GetQrByOrgUseCaseModule = require('../../app/use-cases/qrcode/getQrByOrgUseCase');
      const originalGetQrByOrgUseCase = GetQrByOrgUseCaseModule.GetQrByOrgUseCase;
      GetQrByOrgUseCaseModule.GetQrByOrgUseCase = jest.fn(() => mockUseCase);

      const mockBuffer = Buffer.from('mock-image-data');
      
      // Mock QRCode module - the controller uses QRCode.toBuffer directly
      const QRCodeModule = require('qrcode');
      const originalToBuffer = QRCodeModule.toBuffer || (QRCodeModule.default && QRCodeModule.default.toBuffer);
      
      // Mock toBuffer method
      if (QRCodeModule.default) {
        QRCodeModule.default.toBuffer = jest.fn().mockResolvedValue(mockBuffer);
      }
      QRCodeModule.toBuffer = jest.fn().mockResolvedValue(mockBuffer);
      
      // Re-import controller to get new instances
      delete require.cache[require.resolve('../../interfaces/qrOrganization.controller')];
      const { QrOrganizationController: QrControllerNew } = require('../../interfaces/qrOrganization.controller');

      await QrControllerNew.generateQrImage(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
      expect(res.send).toHaveBeenCalledWith(mockBuffer);

      // Restore
      if (originalToBuffer) {
        if (QRCodeModule.default) {
          QRCodeModule.default.toBuffer = originalToBuffer;
        }
        QRCodeModule.toBuffer = originalToBuffer;
      }
      GetQrByOrgUseCaseModule.GetQrByOrgUseCase = originalGetQrByOrgUseCase;
    });

    it('should return 404 if QR not found', async () => {
      req.params = { organizationId: 'org-id' };

      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          success: false,
        }),
      };
      (require('../../app/use-cases/qrcode/getQrByOrgUseCase').GetQrByOrgUseCase as jest.Mock) = jest.fn(() => mockUseCase);

      await QrOrganizationController.generateQrImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'QR record not found',
      });
    });
  });
});

