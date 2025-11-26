import nodemailer from "nodemailer";

import { EmailService } from "../../domain/email";

export class NodemailerService implements EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: body,
    });
  }
}