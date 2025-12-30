import { Controller, Get, Req, Res, UseGuards, HttpStatus, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { OAuth2LoginResponseDto } from './dto/oauth2-login-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class OAuth2Controller {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND, description: 'Redirects to Google OAuth2 consent screen' })
  @ApiExcludeEndpoint()
  async googleAuth() {
    // The Google OAuth2 flow will be initiated by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect()
  @ApiOperation({ summary: 'Google OAuth2 callback URL' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirects to frontend with JWT token',
    type: OAuth2LoginResponseDto,
  })
  @ApiExcludeEndpoint()
  async googleAuthCallback(@Req() req: any) {
    const user = req.user;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    
    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'USER',
    });

    // Return redirect URL with token
    return {
      url: `${frontendUrl}/auth/callback?token=${token}`,
    };
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Initiate Facebook OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND, description: 'Redirects to Facebook OAuth2 consent screen' })
  @ApiExcludeEndpoint()
  async facebookAuth() {
    // The Facebook OAuth2 flow will be initiated by Passport
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @Redirect()
  @ApiOperation({ summary: 'Facebook OAuth2 callback URL' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirects to frontend with JWT token',
    type: OAuth2LoginResponseDto,
  })
  @ApiExcludeEndpoint()
  async facebookAuthCallback(@Req() req: any) {
    // Similar to Google callback
    return this.googleAuthCallback(req);
  }
}
