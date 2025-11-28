import { Controller, Post, Body, HttpCode, HttpStatus, Get, Headers, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiHeader, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, Matches, IsIn } from 'class-validator';

export const USER_ROLES = ['USER', 'ADMIN', 'MODERATOR'] as const;
export type UserRole = typeof USER_ROLES[number];

class RegisterDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'User\'s email address. Must be unique across the platform.',
    required: true,
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'securePassword123!',
    description: 'User password. Must be at least 6 characters long.',
    required: true,
    minLength: 6,
    format: 'password'
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User\'s first name',
    required: true,
    maxLength: 50
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User\'s last name',
    required: true,
    maxLength: 50
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
  lastName: string;

  @ApiProperty({
    example: 'USER',
    description: 'User role (USER, ADMIN, or MODERATOR)',
    enum: USER_ROLES,
    default: 'USER'
  })
  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  @IsIn(USER_ROLES, { message: 'Invalid user role. Must be one of: ' + USER_ROLES.join(', ') })
  role?: UserRole;
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
    firstName: string;
    lastName: string; // This will be mapped from secondName in the service
    role: string;
  };
}

class UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string; // This will be mapped from secondName in the service
  role: string;
}

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Registers a new user with the provided details. Email must be unique across the platform.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered', 
    type: UserResponse,
    headers: {
      'Set-Cookie': {
        description: 'Sets an HTTP-only cookie with the authentication token',
        schema: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid input data',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: [
            'email must be an email',
            'password must be longer than or equal to 6 characters'
          ],
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Email already exists',
    content: {
      'application/json': {
        example: {
          statusCode: 409,
          message: 'Email already in use',
          error: 'Conflict'
        }
      }
    }
  })
  @ApiBody({ 
    type: RegisterDto,
    description: 'User registration details',
    required: true,
    examples: {
      minimal: {
        summary: 'Minimal registration',
        description: 'Email, password, first name and last name are required',
        value: {
          email: 'user@example.com',
          password: 'securePassword123!',
          firstName: 'John',
          lastName: 'Doe'
        }
      },
      full: {
        summary: 'Full registration',
        description: 'Register with all fields',
        value: {
          email: 'user@example.com',
          password: 'securePassword123!',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER'
        }
      }
    }
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<UserResponse> {
    const user = await this.authService.register(
      body.email, 
      body.password, 
      body.firstName, 
      body.lastName, // This will be mapped to secondName in the service
      body.role
    );
    return { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName || '',
      lastName: user.secondName || '', // Map secondName back to lastName for the response
      role: user.role 
    };
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
