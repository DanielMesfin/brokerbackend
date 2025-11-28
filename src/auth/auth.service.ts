import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { USER_ROLES, UserRole } from './auth.controller';

type PrismaUser = {
  id: string;
  email: string;
  firstName: string | null;
  secondName: string | null;
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
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(email: string, password: string, firstName: string, lastName: string, role: UserRole = 'USER') {
    if (!email || !password || !firstName || !lastName) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException('Email, password, first name, and last name are required');
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
        secondName: lastName,
        role,
        isActive: true
      },
    });
    
    return { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName || '',
      secondName: user.secondName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      refreshToken: user.refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as PrismaUser;
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
      firstName: user.firstName || '',
      secondName: user.secondName,
      phone: user.phone,
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

  async login(user: PrismaUser) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const fullUser = await this.getPublicUserById(user.id);
    return { accessToken, user: fullUser };
  }
}
