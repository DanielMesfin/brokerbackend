import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

export enum VerificationType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async generateVerificationCode(userId: string, type: VerificationType): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiration

    await this.prisma.verificationCode.upsert({
      where: { userId_type: { userId, type } },
      update: { code, expiresAt, isUsed: false },
      create: {
        userId,
        code,
        type,
        expiresAt,
      },
    });

    return code;
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    // Implement your email sending logic here
    await this.mailService.sendVerificationEmail(email, code);
  }

  async verifyCode(userId: string, code: string, type: VerificationType): Promise<boolean> {
    const verification = await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return false;
    }

    // Mark the code as used
    await this.prisma.verificationCode.update({
      where: { id: verification.id },
      data: { isUsed: true },
    });

    // Update user verification status based on type
    if (type === VerificationType.EMAIL) {
      await this.prisma.userProfile.update({
        where: { userId },
        data: { isVerified: true },
      });
    }
    // Add phone verification logic if needed

    return true;
  }
}
