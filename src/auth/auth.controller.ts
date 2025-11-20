import { Controller, Post, Body, HttpCode, HttpStatus, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

class RegisterDto {
  email: string;
  password: string;
  displayName?: string;
}

class LoginDto {
  email: string;
  password: string;
}

class AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
  };
}

class UserResponse {
  id: string;
  email: string;
  displayName?: string;
}

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService, private jwtService: JwtService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  @ApiBody({ 
    type: RegisterDto,
    examples: {
      user: {
        summary: 'User Registration',
        value: {
          email: 'user@example.com',
          password: 'securePassword123!',
          displayName: 'John Doe'
        }
      }
    }
  })
  async register(@Body() body: RegisterDto): Promise<UserResponse> {
    const user = await this.auth.register(body.email, body.password, body.displayName);
    return { id: user.id, email: user.email, displayName: user.displayName };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiBody({ 
    type: LoginDto,
    examples: {
      user: {
        summary: 'User Login',
        value: {
          email: 'user@example.com',
          password: 'securePassword123!'
        }
      }
    }
  })
  async login(@Body() body: LoginDto) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.auth.login(user);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user data', type: UserResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
    required: true,
    example: 'Bearer your-jwt-token-here'
  })
  async me(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException('No token provided');
    }
    
    const token = auth.replace(/^Bearer\s+/i, '');
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'dev-secret' });
      return { user: { id: payload.sub, email: payload.email } };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
