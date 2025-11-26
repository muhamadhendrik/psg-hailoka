import { Request, Response } from "express";

import { ForgotPasswordUseCase } from "../app/use-cases/user/forgot-password.usecase";
import { ResetPasswordUseCase } from "../app/use-cases/user/reset-password.usecase";
import { UserAuthMethodsRepository } from "../infrastructure/repositories/user-auth.repository";
import { NodemailerService } from "../infrastructure/mailer/nodemailer.service";
import { GoogleAuthService } from "../app/use-cases/auth/googleAuth";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { UserRegistrationSchema } from "../app/dto/user/user-registration.dto";
import { RegisterUserUseCase } from "../app/use-cases/user/RegisterUserUseCase";
import { UserLoginSchema } from "../app/dto/user/user-login.dto";
import { LoginUserUseCase } from "../app/use-cases/user/login-user.usecase";
import { RegisterGuestUseCase } from "../app/use-cases/guest/register-guest.usecase";
import { ChangePasswordSchema } from "../app/dto/user/change-password.dto";
import { UpdateProfileSchema } from "../app/dto/user/update-profile.dto";
import { ChangePasswordUseCase } from "../app/use-cases/user/change-password.usecase";
import { UpdateProfileUseCase } from "../app/use-cases/user/update-profile.usecase";

const emailService = new NodemailerService();
const authRepo = new UserAuthMethodsRepository();
const userRepo = new UserRepository();

const forgotPasswordUseCase = new ForgotPasswordUseCase(authRepo, emailService);
const resetPasswordUseCase = new ResetPasswordUseCase(authRepo);
const googleAuth = new GoogleAuthService(userRepo, authRepo);
const registerGuestUseCase = new RegisterGuestUseCase(userRepo, authRepo);
const changePasswordUseCase = new ChangePasswordUseCase(authRepo);
const updateProfileUseCase = new UpdateProfileUseCase(userRepo);

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            // validate
            const parsed = UserRegistrationSchema.parse(req.body);

            // call use case
            const useCase = new RegisterUserUseCase(userRepo);
            const result = await useCase.execute(parsed);

            // shape response DTO
            return res.status(201).json({
                id: result.id,
                name: result.name,
                email: result.email,
                is_verified_email: result.isVerifiedEmail,
                created_at: result.createdAt,
            });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const parsed = UserLoginSchema.parse(req.body);
            const loginUseCase = new LoginUserUseCase(userRepo, authRepo);
            const result = await loginUseCase.execute(parsed);

            // result.token sudah ada
            const token = result.token;

            // Ambil data lengkap user
            const user = await userRepo.findByEmail(parsed.email);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Set cookie token
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 60 * 60 * 1000,
            });

            // Return data user yang sama seperti /users/me
            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    user_type: user.userType || null,
                },
            });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async logout(req: Request, res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            // sameSite: "strict",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return res.json({ message: "Logged out successfully" });
    }

    static async registerGuest(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const result = await registerGuestUseCase.execute(name);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            await forgotPasswordUseCase.execute(email);
            res.json({ message: "Password reset email sent" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;
            await resetPasswordUseCase.execute(token, newPassword);
            res.json({ message: "Password has been reset successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async googleLogin(req: Request, res: Response) {
        try {
            const { token } = req.body; // frontend sends Google ID token
            //   const { user, isNew } = await this.googleAuthService.loginOrRegisterGoogle(token);
            const { user, isNew } = await googleAuth.loginOrRegisterGoogle(
                token
            );

            res.json({ user, isNew });
        } catch (error) {
            // console.log("error googleLogin >>> ", error);
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const parsed = ChangePasswordSchema.parse(req.body);

            const userId = res.locals.user_id as string;
            if (!userId) {
                return res.status(401).json({ error: "Unauthenticated" });
            }

            await changePasswordUseCase.execute({
                userId,
                currentPassword: parsed.currentPassword,
                newPassword: parsed.newPassword,
            });

            return res.json({ message: "Password updated successfully" });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const parsed = UpdateProfileSchema.parse(req.body);

            const userId = res.locals.user_id as string;
            if (!userId) {
                return res.status(401).json({ error: "Unauthenticated" });
            }

            const updatedUser = await updateProfileUseCase.execute({
                userId,
                ...parsed,
            });

            return res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                user_type: updatedUser.userType || null,
            });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}
