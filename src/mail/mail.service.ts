import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { compile } from 'handlebars';

const readFile = promisify(fs.readFile);

type HandlebarsTemplateDelegate = (context: any) => string;

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT', 587),
      secure: this.configService.get('MAIL_SECURE', false),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  private async getTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    try {
      const templateContent = await readFile(templatePath, 'utf8');
      const template = compile(templateContent);
      this.templateCache.set(templateName, template);
      return template;
    } catch (error) {
      throw new Error(`Failed to load email template: ${templateName}`);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    const template = await this.getTemplate('verification');
    
    const html = template({
      name: email.split('@')[0],
      verificationUrl,
    });

    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM'),
        to: email,
        subject: 'Please confirm your email',
        html,
        text: `Please verify your email by visiting: ${verificationUrl}`,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}
