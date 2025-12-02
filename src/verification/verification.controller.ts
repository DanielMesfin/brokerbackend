import { Controller, Post, Body, Get, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VerificationService, VerificationType } from './verification.service';
import { VerifyUserDto } from './dto/verify-user.dto';

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('send-email')
  @ApiOperation({ summary: 'Send verification email' })
  @ApiResponse({ status: 200, description: 'Verification email sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
    },
  })
  async sendVerificationEmail(@Body('email') email: string) {
    // Get user by email using the service method
    const user = await this.verificationService.findUserByEmail(email);

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, message: 'User not found' };
    }

    const code = await this.verificationService.generateVerificationCode(
      user.id,
      VerificationType.EMAIL,
    );

    await this.verificationService.sendVerificationEmail(email, code);
    return { status: HttpStatus.OK, message: 'Verification email sent' };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user with code' })
  @ApiResponse({ status: 200, description: 'User verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
  async verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    const isValid = await this.verificationService.verifyCode(
      verifyUserDto.userId,
      verifyUserDto.verificationCode,
      VerificationType.EMAIL,
    );

    if (!isValid) {
      return { status: HttpStatus.BAD_REQUEST, message: 'Invalid or expired verification code' };
    }

    return { status: HttpStatus.OK, message: 'User verified successfully' };
  }
}
