import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { USER_ROLES, UserRole } from './auth.controller';

type PrismaUser = {
  id: string;
  email: string;
  firstName: string;
  secondName: string | null;
  lastName: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  lastLogin?: Date | null;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  async register(
    email: string, 
    password: string, 
    firstName: string, 
    secondName: string | null, 
    lastName: string, 
    phone?: string, 
    role: UserRole = 'USER'
  ) {
    if (!email || !password || !firstName || !lastName) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException('Email, password, first name, and last name are required');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException('Please provide a valid email address');
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
    }
    
    const existing = await this.prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existing) {
      const { ConflictException } = await import('@nestjs/common');
      throw new ConflictException('Email already in use');
    }
    
    if (!USER_ROLES.includes(role)) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException(`Invalid role. Must be one of: ${USER_ROLES.join(', ')}`);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        firstName,
        secondName,
        lastName,
        phone: phone || null,
        role,
        isActive: true
      },
    });
    
    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);
    
    // Update user with refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        secondName: user.secondName || '',
        lastName: user.lastName,
        phone: user.phone || '',
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  async validateUser(email: string, password: string) {
    if (!email) {
      return null;
    }
    
    const user = await this.prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Update last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      secondName: user.secondName || '',
      lastName: user.lastName,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      refreshToken: user.refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async getPublicUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: { socialLinks: true },
        },
      },
    });
    if (!user) return null;
    // Exclude sensitive fields
    const { passwordHash, refreshToken, ...rest } = user as any;
    return rest;
  }

  async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'jwt-access-secret',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async login(user: PrismaUser) {
    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);
    
    // Update refresh token in database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Get complete user data without sensitive information
    const userData = await this.getPublicUserById(user.id);
    
    // Return complete user data along with tokens
    return {
      ...tokens,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.secondName || '',
        phone: userData.phone || '',
        role: userData.role,
        isActive: userData.isActive,
        lastLogin: userData.lastLogin,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      }
    };
  }
}
