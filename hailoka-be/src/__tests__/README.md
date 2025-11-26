# Unit Tests Documentation

## Overview
This directory contains unit tests for all API controllers in the Hailoka Backend Service.

## Test Structure
```
src/__tests__/
├── setup.ts                    # Jest setup configuration
├── helpers/
│   ├── mockFactory.ts          # Factory functions for creating mocks
│   ├── repositoryMocks.ts      # Repository mock factories
│   └── serviceMocks.ts         # Service mock factories
└── controllers/
    ├── auth.controller.test.ts
    ├── user.controller.test.ts
    ├── organization.controller.test.ts
    ├── staff.controller.test.ts
    ├── extension.controller.test.ts
    ├── extensionRule.controller.test.ts
    ├── qrOrganization.controller.test.ts
    ├── call.controller.test.ts
    └── role.controller.test.ts
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run a specific test file
```bash
npm test -- auth.controller.test.ts
```

## Test Coverage

The tests cover:
- ✅ All controller endpoints
- ✅ Success scenarios
- ✅ Error handling
- ✅ Validation
- ✅ Authentication checks
- ✅ Authorization checks

## Mocking Strategy

### Repositories
All repositories are mocked to avoid database dependencies. Use the mock factories from `helpers/repositoryMocks.ts`.

### Services
External services (email, Google Auth, etc.) are mocked using factories from `helpers/serviceMocks.ts`.

### Request/Response
Use `mockFactory.ts` to create mock Express Request and Response objects.

## Writing New Tests

1. Import necessary dependencies and mocks
2. Use `createMockRequest()` and `createMockResponse()` for HTTP mocks
3. Mock repositories and services using the provided factories
4. Test both success and error scenarios
5. Verify response status codes and JSON payloads

## Example Test Structure

```typescript
import { MyController } from '../../interfaces/my.controller';
import { createMockRequest, createMockResponse } from '../helpers/mockFactory';

describe('MyController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('myEndpoint', () => {
    it('should handle success case', async () => {
      // Arrange
      req.body = { /* test data */ };
      
      // Act
      await MyController.myEndpoint(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        // expected response
      }));
    });
  });
});
```

