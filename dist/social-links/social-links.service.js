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
exports.SocialLinksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SocialLinksService = class SocialLinksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createSocialLinksDto) {
        const userProfile = await this.prisma.userProfile.findUnique({
            where: { userId },
            include: {
                socialLinks: true,
            },
        });
        if (!userProfile) {
            throw new common_1.NotFoundException('User profile not found');
        }
        if (userProfile.socialLinks) {
            throw new common_1.ConflictException('Social links already exist for this user');
        }
        const socialLinks = await this.prisma.socialLink.create({
            data: {
                ...createSocialLinksDto,
            },
        });
        await this.prisma.userProfile.update({
            where: { id: userProfile.id },
            data: {
                socialLinks: {
                    connect: { id: socialLinks.id },
                },
            },
        });
        const result = await this.prisma.socialLink.findUnique({
            where: { id: socialLinks.id },
            include: {
                userProfile: true,
            },
        });
        return result;
    }
    async findByUserId(userId) {
        const userProfile = await this.prisma.userProfile.findUnique({
            where: { userId },
            include: {
                socialLinks: true,
            },
        });
        if (!userProfile) {
            throw new common_1.NotFoundException('User profile not found');
        }
        return userProfile.socialLinks;
    }
    async findOne(id) {
        const socialLinks = await this.prisma.socialLink.findUnique({
            where: { id },
            include: {
                userProfile: true,
            },
        });
        if (!socialLinks) {
            throw new common_1.NotFoundException('Social links not found');
        }
        return socialLinks;
    }
    async update(id, updateSocialLinksDto) {
        const existingSocialLinks = await this.prisma.socialLink.findUnique({
            where: { id },
        });
        if (!existingSocialLinks) {
            throw new common_1.NotFoundException('Social links not found');
        }
        const updatedSocialLinks = await this.prisma.socialLink.update({
            where: { id },
            data: updateSocialLinksDto,
            include: {
                userProfile: true,
            },
        });
        return updatedSocialLinks;
    }
    async remove(id) {
        const existingSocialLinks = await this.prisma.socialLink.findUnique({
            where: { id },
        });
        if (!existingSocialLinks) {
            throw new common_1.NotFoundException('Social links not found');
        }
        await this.prisma.socialLink.delete({
            where: { id },
        });
        return { message: 'Social links deleted successfully' };
    }
    async findByUserIdAndUpdate(userId, updateSocialLinksDto) {
        const userProfile = await this.prisma.userProfile.findUnique({
            where: { userId },
            include: {
                socialLinks: true,
            },
        });
        if (!userProfile) {
            throw new common_1.NotFoundException('User profile not found');
        }
        if (!userProfile.socialLinks) {
            return this.create(userId, updateSocialLinksDto);
        }
        return this.update(userProfile.socialLinks.id, updateSocialLinksDto);
    }
};
exports.SocialLinksService = SocialLinksService;
exports.SocialLinksService = SocialLinksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SocialLinksService);
//# sourceMappingURL=social-links.service.js.map