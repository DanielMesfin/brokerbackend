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
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PromotionService = class PromotionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToResponse(promotion) {
        return {
            id: promotion.id,
            title: promotion.title,
            description: promotion.description || undefined,
            imageUrl: promotion.imageUrl || undefined,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
            isActive: promotion.isActive,
            maxClaims: promotion.maxClaims,
            currentClaims: promotion.currentClaims,
            pointsCost: promotion.pointsCost,
            category: promotion.category,
            businessId: promotion.businessId,
            createdAt: promotion.createdAt,
            updatedAt: promotion.updatedAt
        };
    }
    async create(createPromotionDto) {
        const promotion = await this.prisma.promotion.create({
            data: {
                title: createPromotionDto.title,
                description: createPromotionDto.description,
                imageUrl: createPromotionDto.imageUrl,
                startDate: createPromotionDto.startDate,
                endDate: createPromotionDto.endDate,
                isActive: createPromotionDto.isActive,
                maxClaims: createPromotionDto.maxClaims,
                pointsCost: createPromotionDto.pointsCost,
                category: createPromotionDto.category,
                businessId: createPromotionDto.businessId,
            },
            include: {
                business: true
            }
        });
        return this.mapToResponse(promotion);
    }
    async findAll(filters = {}) {
        const where = {};
        if (filters.category) {
            where.category = filters.category;
        }
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.businessId) {
            where.businessId = filters.businessId;
        }
        const promotions = await this.prisma.promotion.findMany({
            where,
            include: {
                business: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return promotions.map(promotion => this.mapToResponse(promotion));
    }
    async findOne(id) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id },
            include: {
                business: true
            }
        });
        if (!promotion) {
            throw new common_1.NotFoundException(`Promotion with ID ${id} not found`);
        }
        return this.mapToResponse(promotion);
    }
    async update(id, updatePromotionDto) {
        await this.findOne(id);
        const updatedPromotion = await this.prisma.promotion.update({
            where: { id },
            data: {
                ...updatePromotionDto,
            },
            include: {
                business: true
            }
        });
        return this.mapToResponse(updatedPromotion);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.promotion.delete({
            where: { id },
        });
    }
    async claimPromotion(id, userId) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id },
        });
        if (!promotion) {
            throw new common_1.NotFoundException(`Promotion with ID ${id} not found`);
        }
        if (!promotion.isActive) {
            throw new common_1.BadRequestException('This promotion is not active');
        }
        if (promotion.currentClaims >= promotion.maxClaims) {
            throw new common_1.BadRequestException('This promotion has reached its maximum number of claims');
        }
        const existingClaim = await this.prisma.promotionClaim.findUnique({
            where: {
                userId_promotionId: {
                    userId,
                    promotionId: id,
                },
            },
        });
        if (existingClaim) {
            throw new common_1.BadRequestException('You have already claimed this promotion');
        }
        const result = await this.prisma.$transaction(async (prisma) => {
            await prisma.promotionClaim.create({
                data: {
                    userId,
                    promotionId: id,
                    points: promotion.pointsCost,
                },
            });
            const updatedPromotion = await prisma.promotion.update({
                where: { id },
                data: {
                    currentClaims: {
                        increment: 1,
                    },
                },
                include: {
                    business: true,
                },
            });
            return updatedPromotion;
        });
        return { success: true };
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map