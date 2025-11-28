"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_controller_1 = require("./auth.controller");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(email, password, firstName, lastName, role = 'USER') {
        if (!email || !password || !firstName || !lastName) {
            const { BadRequestException } = await Promise.resolve().then(() => require('@nestjs/common'));
            throw new BadRequestException('Email, password, first name, and last name are required');
        }
        const existing = await this.prisma.user.findUnique({
            where: { email }
        });
        if (existing) {
            const { ConflictException } = await Promise.resolve().then(() => require('@nestjs/common'));
            throw new ConflictException('Email already in use');
        }
        if (!auth_controller_1.USER_ROLES.includes(role)) {
            const { BadRequestException } = await Promise.resolve().then(() => require('@nestjs/common'));
            throw new BadRequestException(`Invalid role. Must be one of: ${auth_controller_1.USER_ROLES.join(', ')}`);
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
        };
    }
    async validateUser(email, password) {
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
    async getPublicUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                profile: {
                    include: { socialLinks: true },
                },
            },
        });
        if (!user)
            return null;
        const { passwordHash, refreshToken, ...rest } = user;
        return rest;
    }
    async login(user) {
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        const fullUser = await this.getPublicUserById(user.id);
        return { accessToken, user: fullUser };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(jwt_1.JwtService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map