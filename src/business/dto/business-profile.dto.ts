import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsUrl, IsUUID } from 'class-validator';
import { CollaborationType } from '@prisma/client';

export class CreateBusinessProfileDto {
  @ApiProperty({ example: 'Acme Corp', description: 'The name of the business' })
  @IsString()
  businessName: string;

  @ApiProperty({ example: 'Leading provider of innovative solutions', description: 'Business description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Technology', description: 'Industry sector' })
  @IsString()
  industry: string;

  @ApiProperty({ example: 'New York, USA', description: 'Business location', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'https://acmecorp.com', description: 'Business website', required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'https://example.com/logo.png', description: 'URL to business logo', required: false })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    example: ['CO_MARKETING', 'TECH_PARTNERSHIP'],
    description: 'Types of collaborations the business is interested in',
    enum: CollaborationType,
    isArray: true,
    required: false
  })
  @IsArray()
  @IsEnum(CollaborationType, { each: true })
  @IsOptional()
  collaborationTypes?: CollaborationType[];

  @ApiProperty({ example: 'Increase brand awareness', description: 'Business goals', required: false })
  @IsString()
  @IsOptional()
  goals?: string;
}

export class UpdateBusinessProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsEnum(CollaborationType, { each: true })
  @IsOptional()
  collaborationTypes?: CollaborationType[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  goals?: string;
}

export class BusinessProfileResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  businessName: string;

  @ApiProperty({ example: 'Leading provider of innovative solutions' })
  description?: string;

  @ApiProperty({ example: 'Technology' })
  industry: string;

  @ApiProperty({ example: 'New York, USA' })
  location?: string;

  @ApiProperty({ example: 'https://acmecorp.com' })
  website?: string;

  @ApiProperty({ example: 'https://example.com/logo.png' })
  logoUrl?: string;

  @ApiProperty({
    example: ['CO_MARKETING', 'TECH_PARTNERSHIP'],
    enum: CollaborationType,
    isArray: true
  })
  collaborationTypes?: string[];

  @ApiProperty({ example: 'Increase brand awareness' })
  goals?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
