// Repository mocks for testing
export const createMockUserRepository = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  updateProfile: jest.fn(),
  createUserAuthMethod: jest.fn(),
});

export const createMockRoleRepository = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockOrganizationRepository = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findOrganizationsByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockUserAuthRepository = () => ({
  findPasswordAuthByEmail: jest.fn(),
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockExtensionRepository = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByOrganizationId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockStaffRepository = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByOrganizationId: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockExtensionRuleRepository = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByOrganizationId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockQrRepository = () => ({
  create: jest.fn(),
  findByOrganizationId: jest.fn(),
  findByQrUrl: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockCallRepository = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

