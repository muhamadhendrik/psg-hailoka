import { EmailService } from "../../../domain/email";

export class SendWelcomeEmailUseCase {
  constructor(private emailService: EmailService) {}

  async execute(userEmail: string, userName: string): Promise<void> {
    const subject = "Welcome to Our App!";
    const body = `<h1>Hello ${userName},</h1><p>Thanks for registering!</p>`;
    await this.emailService.sendMail(userEmail, subject, body);
  }
}