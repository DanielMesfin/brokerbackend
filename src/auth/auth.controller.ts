import { Controller, Post, Body, HttpCode, HttpStatus, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiHeader, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123!' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  secondName?: string;

  @ApiProperty({ example: '+251900000000', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123!' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

class AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    secondName?: string | null;
    phone?: string | null;
  };
}

class UserResponse {
  id: string;
  email: string;
  firstName?: string | null;
  secondName?: string | null;
  phone?: string | null;
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
          firstName: 'John',
          secondName: 'Doe',
          phone: '+251900000000'
        }
      }
    }
  })
  async register(@Body() body: RegisterDto): Promise<UserResponse> {
    const user = await this.auth.register(body.email, body.password, body.firstName, body.secondName, body.phone);
    return { id: user.id, email: user.email, firstName: user.firstName ?? null, secondName: user.secondName ?? null, phone: user.phone ?? null };
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
  @ApiResponse({ status: 200, description: 'Returns current user data' })
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
      const user = await this.auth.getPublicUserById(payload.sub);
      return { user };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
