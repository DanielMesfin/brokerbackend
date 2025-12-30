import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto, UpdatePromotionDto, PromotionResponseDto } from './dto/promotion.dto';
import { Prisma, Promotion as PromotionModel } from '@prisma/client';

type PromotionWithBusiness = Prisma.PromotionGetPayload<{
  include: { business: true }
}>;

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}

  private mapToResponse(promotion: PromotionWithBusiness): PromotionResponseDto {
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

  async create(createPromotionDto: CreatePromotionDto): Promise<PromotionResponseDto> {
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

  async findAll(filters: {
    category?: string;
    isActive?: boolean;
    businessId?: string;
  } = {}): Promise<PromotionResponseDto[]> {
    const where: Prisma.PromotionWhereInput = {};

    if (filters.category) {
      where.category = filters.category as any;
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

    return promotions.map(promotion => this.mapToResponse(promotion as PromotionWithBusiness));
  }

  async findOne(id: string): Promise<PromotionResponseDto> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        business: true
      }
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return this.mapToResponse(promotion as PromotionWithBusiness);
  }

  async update(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<PromotionResponseDto> {
    // Check if promotion exists
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

    return this.mapToResponse(updatedPromotion as PromotionWithBusiness);
  }

  async remove(id: string): Promise<void> {
    // Check if promotion exists
    await this.findOne(id);

    await this.prisma.promotion.delete({
      where: { id },
    });
  }

  async claimPromotion(id: string, userId: string): Promise<{ success: boolean }> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    if (!promotion.isActive) {
      throw new BadRequestException('This promotion is not active');
    }

    if (promotion.currentClaims >= promotion.maxClaims) {
      throw new BadRequestException('This promotion has reached its maximum number of claims');
    }

    // Check if user has already claimed this promotion
    const existingClaim = await this.prisma.promotionClaim.findUnique({
      where: {
        userId_promotionId: {
          userId,
          promotionId: id,
        },
      },
    });

    if (existingClaim) {
      throw new BadRequestException('You have already claimed this promotion');
    }

    // Start transaction to ensure data consistency
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create the claim
      await prisma.promotionClaim.create({
        data: {
          userId,
          promotionId: id,
          points: promotion.pointsCost,
        },
      });

      // Update the promotion's claim count
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
}
