import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, Min, Max, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { PromotionType, PromotionStatus } from '../entities/promotion.entity';

export class CreatePromotionDto {
  @ApiProperty({ description: 'Promotion name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Promotion description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: PromotionType, description: 'Type of promotion' })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)' })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ description: 'Promotion code (unique identifier)' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Start date of the promotion', type: 'string', format: 'date-time' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'End date of the promotion', type: 'string', format: 'date-time' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ description: 'Maximum number of times this promotion can be used (0 for unlimited)' })
  @IsNumber()
  @Min(0)
  maxUses: number;

  @ApiProperty({ description: 'Maximum discount amount (for percentage discounts)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscountAmount?: number;

  @ApiProperty({ description: 'Minimum order amount required to apply this promotion' })
  @IsNumber()
  @Min(0)
  minOrderAmount: number;

  @ApiProperty({ description: 'Whether the promotion is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({ description: 'List of business IDs this promotion applies to (empty for all)' })
  @IsString({ each: true })
  @IsOptional()
  businessIds?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdatePromotionDto {
  @ApiPropertyOptional({ description: 'Promotion name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Promotion description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: PromotionStatus, description: 'Status of the promotion' })
  @IsEnum(PromotionStatus)
  @IsOptional()
  status?: PromotionStatus;

  @ApiPropertyOptional({ description: 'Discount value (percentage or fixed amount)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @ApiPropertyOptional({ description: 'End date of the promotion', type: 'string', format: 'date-time' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Maximum number of times this promotion can be used' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxUses?: number;

  @ApiPropertyOptional({ description: 'Whether the promotion is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class PromotionResponseDto {
  @ApiProperty({ description: 'Promotion ID' })
  id: string;

  @ApiProperty({ description: 'Promotion name' })
  name: string;

  @ApiProperty({ description: 'Promotion description' })
  description: string;

  @ApiProperty({ enum: PromotionType, description: 'Type of promotion' })
  type: PromotionType;

  @ApiProperty({ description: 'Discount value' })
  value: number;

  @ApiProperty({ description: 'Promotion code' })
  code: string;

  @ApiProperty({ description: 'Start date', type: 'string', format: 'date-time' })
  startDate: Date;

  @ApiProperty({ description: 'End date', type: 'string', format: 'date-time' })
  endDate: Date;

  @ApiProperty({ description: 'Current usage count' })
  usageCount: number;

  @ApiProperty({ description: 'Maximum usage limit' })
  maxUses: number;

  @ApiProperty({ description: 'Maximum discount amount' })
  maxDiscountAmount: number | null;

  @ApiProperty({ description: 'Minimum order amount' })
  minOrderAmount: number;

  @ApiProperty({ enum: PromotionStatus, description: 'Current status' })
  status: PromotionStatus;

  @ApiProperty({ description: 'Creation timestamp', type: 'string', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', type: 'string', format: 'date-time' })
  updatedAt: Date;
}
