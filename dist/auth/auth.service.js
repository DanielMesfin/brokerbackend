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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(email, password, firstName, secondName, phone) {
        var _a, _b, _c;
        if (!email || !password) {
            const { BadRequestException } = await Promise.resolve().then(() => require('@nestjs/common'));
            throw new BadRequestException('Email and password are required');
        }
        const existing = await this.prisma.user.findUnique({
            where: { email: email }
        });
        if (existing) {
            const { ConflictException } = await Promise.resolve().then(() => require('@nestjs/common'));
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
            firstName: (_a = user.firstName) !== null && _a !== void 0 ? _a : null,
            secondName: (_b = user.secondName) !== null && _b !== void 0 ? _b : null,
            phone: (_c = user.phone) !== null && _c !== void 0 ? _c : null,
        };
    }
    async validateUser(email, password) {
        var _a, _b, _c;
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
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        return {
            id: user.id,
            email: user.email,
            firstName: (_a = user.firstName) !== null && _a !== void 0 ? _a : null,
            secondName: (_b = user.secondName) !== null && _b !== void 0 ? _b : null,
            phone: (_c = user.phone) !== null && _c !== void 0 ? _c : null,
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map