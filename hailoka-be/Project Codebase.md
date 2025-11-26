## 1. Core Modules & Directory Responsibilities
- `src/`
  - `index.ts`, `server.ts`: App entry points, server setup.
  - `app/`
    - `dto/`: Data Transfer Objects for request/response validation.
      - `auth/`, `user/`, `guest/`: DTOs for different user flows.
    - `use-cases/`: Business logic, organized by domain (auth, email, guest, user).
      - Each use-case is a service handling a specific workflow (e.g., user registration, password reset).
  - `domain/`: Core domain models (e.g., `user.ts`, `email.ts`).
  - `infrastructure/`
    - `database/`: DB config, Sequelize setup, migrations, models.
    - `mailer/`: Email service integration (e.g., Nodemailer).
    - `repositories/`: Data access layer, interfaces to DB models.
  - `interfaces/`: API controllers (handle HTTP requests, call use-cases).
## 2. Main Workflow
1. API Request → Controller (`interfaces/`)
2. Controller validates input (using DTOs), calls relevant **Use Case** (`app/use-cases/`)
3. Use Case performs business logic, interacts with **Repositories** (`infrastructure/repositories/`)
4. Repository accesses **Database Models** (`infrastructure/database/models/`)
5. Mailer or other services are called as needed
6. Response returned to client

**Example:**
`POST /api/user/register`
- `user.controller.ts`
- `RegisterUserUseCase.ts`
- `user.repository.ts`
- `user.model.ts` (Sequelize)
- Response
## 3. Tech Stack Summary
- Node.js + TypeScript
- Express (inferred from controllers, not shown directly)
- Sequelize (ORM for SQL DB)
- Nodemailer (email service)
- Nodemon (dev auto-reload)
- Project config: `tsconfig.json`, `nodemon.json`, `package.json`
## 4. How to Add a New Module or API Endpoint
**Step-by-step:**
1. Define DTOs
   - Create a new file in `src/app/dto/[domain]/` for request/response shapes.
2. Implement Use Case
   - Add a new service in `src/app/use-cases/[domain]/` for business logic.
3. Update Controller
   - Add a new route handler in `src/interfaces/[domain].controller.ts`.
   - Validate input using DTOs, call the use-case.
4. Repository & Model
   - If new DB logic is needed, update/create repository in `src/infrastructure/repositories/`.
   - Add/update Sequelize model in `src/infrastructure/database/models/`.
   - Create migration in `src/infrastructure/database/migrations/` if schema changes.
5. Wire Up Route
   - Ensure the new controller method is exposed via Express routes (usually in `server.ts` or a router file).
## 5. Naming Conventions
- Files:
  - `*.controller.ts` — API controllers
  - `*.dto.ts` — Data Transfer Objects
  - `*.usecase.ts` or `*UseCase.ts` — Business logic/services
  - `*.repository.ts` — Data access layer
  - `*.model.ts` — Sequelize models
- Classes/Functions:
  - PascalCase for classes (`RegisterUserUseCase`)
  - camelCase for functions and variables
- Routes:
  - RESTful, grouped by domain: `/api/user/`, `/api/auth/`, etc.
## Quick Reference
- Add endpoint: DTO → Use Case → Controller → Repository → Model → Migration
- Layered structure: Controller → Use Case → Repository → Model
## 6. Example Implementation
1. API Route Layer (server.ts)
Defines the registration endpoint, handled by UserController.register
```
app.post("/users/registration", UserController.register);
```
 2. Controller Layer (user.controller.ts)
Receives request, validates input using DTO, calls use case
```
export class UserController {
  static async register(req, res) {
    // Validate request body using UserRegistrationDto
    const dto = UserRegistrationSchema.parse(req.body);
    // Call the registration use case/service
    const result = await RegisterUserUseCase.execute(dto);
    // Return response
    res.status(result.success ? 201 : 400).json(result);
  }
}
```
3. DTO Layer (user-registration.dto.ts)
Defines expected shape and validation for registration data
```
import { z } from "zod";
export const UserRegistrationSchema = z.object({
	email: z.email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	// other fields
}).refine((data) => data.password === data.confirmPassword, {
	path: ["confirmPassword"], // highlight confirmPassword field in error
	message: "Passwords do not match",
});
export type UserRegistrationRequestDTO = z.infer<typeof UserRegistrationSchema>;
```
4. Use Case / Service Layer (RegisterUserUseCase.ts)
Handles business logic: validation, password hashing, calls repository
```
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import bcrypt from "bcrypt";

export class RegisterUserUseCase {
  static async execute(dto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // Create user in DB via repository
    const user = await UserRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });
    // Return result
    return user
      ? { success: true, user }
      : { success: false, error: "Registration failed" };
  }
}
```
5. Repository Layer (user.repository.ts)
Interacts with Sequelize model to persist user
```
import { User } from "../database/models/user.model";

export const UserRepository = {
  async create({ email, password, name }) {
    // Insert user record into DB
    return await User.create({ email, password, name });
  },
  // ...other methods
};
```
6. Model Layer (user.model.ts)
Sequelize model definition for User
```
import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    // ...other fields
  },
  { sequelize, modelName: "User" }
);
```