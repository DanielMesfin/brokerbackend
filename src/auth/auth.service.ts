import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

type PrismaUser = {
  id: string;
  email: string;
  firstName?: string | null;
  secondName?: string | null;
  phone?: string | null;
};

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(email: string, password: string, firstName?: string, secondName?: string, phone?: string) {
    if (!email || !password) {
      const { BadRequestException } = await import('@nestjs/common');
      throw new BadRequestException('Email and password are required');
    }
    
    const existing = await this.prisma.user.findUnique({ 
      where: { email: email } 
    });
    
    if (existing) {
      const { ConflictException } = await import('@nestjs/common');
      throw new ConflictException('Email already in use');
    }
    
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ 
      data: { 
        email: email, 
        passwordHash: hash, 
        firstName: firstName || null,
        secondName: secondName || null,
        phone: phone || null,
        role: 'USER',
        isActive: true
      } 
    });
    
    return { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName ?? null,
      secondName: user.secondName ?? null,
      phone: user.phone ?? null,
    } as PrismaUser;
  }

  async validateUser(email: string, password: string) {
    if (!email) {
      return null;
    }
    
    const user = await this.prisma.user.findUnique({ 
      where: { email: email } 
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
      firstName: user.firstName ?? null,
      secondName: user.secondName ?? null,
      phone: user.phone ?? null,
    } as PrismaUser;
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
