import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsInt, Min, IsDateString, IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PromotionCategory } from '@prisma/client';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Summer Sale', description: 'Title of the promotion' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Get 50% off on all summer collections', description: 'Detailed description of the promotion', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/promotion.jpg', description: 'URL to promotion image', required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: '2023-06-01T00:00:00.000Z', description: 'Start date of the promotion' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-08-31T23:59:59.000Z', description: 'End date of the promotion' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: true, description: 'Whether the promotion is currently active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ example: 100, description: 'Maximum number of claims allowed for this promotion' })
  @IsInt()
  @Min(1)
  maxClaims: number;

  @ApiProperty({ example: 10, description: 'Points required to claim this promotion' })
  @IsInt()
  @Min(0)
  pointsCost: number;

  @ApiProperty({ 
    example: 'FASHION', 
    description: 'Category of the promotion',
    enum: PromotionCategory
  })
  @IsEnum(PromotionCategory)
  category: PromotionCategory;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'ID of the business that owns this promotion' 
  })
  @IsUUID()
  @IsNotEmpty()
  businessId: string;
}

export class UpdatePromotionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxClaims?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  pointsCost?: number;

  @ApiProperty({ required: false, enum: PromotionCategory })
  @IsEnum(PromotionCategory)
  @IsOptional()
  category?: PromotionCategory;
}

export class PromotionResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Summer Sale' })
  title: string;

  @ApiProperty({ example: 'Get 50% off on all summer collections' })
  description?: string;

  @ApiProperty({ example: 'https://example.com/promotion.jpg' })
  imageUrl?: string;

  @ApiProperty({ example: '2023-06-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2023-08-31T23:59:59.000Z' })
  endDate: Date;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 100 })
  maxClaims: number;

  @ApiProperty({ example: 42 })
  currentClaims: number;

  @ApiProperty({ example: 10 })
  pointsCost: number;

  @ApiProperty({ enum: PromotionCategory, example: 'FASHION' })
  category: PromotionCategory;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  businessId: string;

  @ApiProperty({ example: '2023-05-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-05-01T00:00:00.000Z' })
  updatedAt: Date;
}
