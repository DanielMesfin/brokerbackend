import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ListingType {
  C2C = 'C2C',
  B2B = 'B2B',
  B2C = 'B2C',
  B2G = 'B2G',
}

export class CreateListingDto {
  @ApiProperty({
    description: 'Title of the listing',
    example: 'Premium Office Chairs - Bulk Order',
    maxLength: 100,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the listing',
    example: 'High-quality ergonomic office chairs available for bulk purchase. Perfect for B2B orders.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Type of listing',
    enum: ListingType,
    example: ListingType.B2B,
  })
  @IsEnum(ListingType)
  type: ListingType;

  @ApiProperty({
    description: 'Price per unit',
    minimum: 0,
    example: 199.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Category of the listing',
    example: 'Office Furniture',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Tags for better searchability',
    example: ['office', 'furniture', 'ergonomic', 'bulk'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Commission rate for the listing (if applicable)',
    minimum: 0,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  commissionRate?: number;

  @IsOptional()
  @IsBoolean()
  isNegotiable: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
