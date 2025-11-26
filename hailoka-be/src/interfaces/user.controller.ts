import { Request, Response } from "express";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { CreateUser } from "../app/use-cases/user/createUser";
import { GetUsers } from "../app/use-cases/user/getUsers";

import { UserRegistrationSchema } from "../app/dto/user/user-registration.dto";
import { RegisterUserUseCase } from "../app/use-cases/user/RegisterUserUseCase";
import { UserLoginSchema } from "../app/dto/user/user-login.dto";
import { LoginUserUseCase } from "../app/use-cases/user/login-user.usecase";
import { UserAuthMethodsRepository } from "../infrastructure/repositories/user-auth.repository";

import { SendWelcomeEmailUseCase } from "../app/use-cases/email/send-welcome-email.usecase";
import { NodemailerService } from "../infrastructure/mailer/nodemailer.service";

import { RegisterGuestUseCase } from "../app/use-cases/guest/register-guest.usecase";

const emailService = new NodemailerService();
const sendWelcomeEmailUseCase = new SendWelcomeEmailUseCase(emailService);

const repo = new UserRepository();
const authRepo = new UserAuthMethodsRepository();

const registerGuestUseCase = new RegisterGuestUseCase(repo, authRepo);

export class UserController {
    static async create(req: Request, res: Response) {
        try {
            const useCase = new CreateUser(repo);
            const user = await useCase.execute(req.body);

            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    static async getAll(req: Request, res: Response) {
        const useCase = new GetUsers(repo);
        const users = await useCase.execute();
        res.json(users);
    }

    static async testEmail(req: Request, res: Response) {
        try {
            const { email, name } = req.body;

            await sendWelcomeEmailUseCase.execute(email, name);

            res.json({ message: "Test email sent successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to send test email" });
        }
    }

    // old
    // static async me(req: Request, res: Response) {
    //     try {
    //         const userId = res.locals.user_id;

    //         if (!userId) {
    //             return res.status(401).json({ error: "Unauthorized" });
    //         }

    //         const userRepo = new UserRepository();
    //         const user = await userRepo.findById(userId);

    //         if (!user) {
    //             return res.status(404).json({ error: "User not found" });
    //         }

    //         return res.json({
    //             id: user.id,
    //             name: user.name,
    //             email: user.email,
    //             user_type: res.locals.user_type,
    //         });
    //     } catch (err: any) {
    //         return res.status(500).json({ error: err.message });
    //     }
    // }

    //new

    static async me(req: Request, res: Response) {
        try {
            const userId = res.locals.user_id;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const userRepo = new UserRepository();
            const user = await userRepo.findById(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: res.locals.user_type,
            });
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }
}
