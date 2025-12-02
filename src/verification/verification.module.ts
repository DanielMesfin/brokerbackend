import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [VerificationController],
  providers: [VerificationService, PrismaService],
  exports: [VerificationService],
})
export class VerificationModule {}
