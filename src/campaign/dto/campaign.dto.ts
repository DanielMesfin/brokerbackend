import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum CampaignCollaboratorRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CONTRIBUTOR = 'CONTRIBUTOR'
}

export enum CampaignProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class CreateCampaignDto {
  @ApiProperty({ description: 'Name of the campaign' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the campaign', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Start date of the campaign (ISO string)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date of the campaign (ISO string)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Budget for the campaign', required: false })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiProperty({ description: 'Target audience description', required: false })
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @ApiProperty({ description: 'ID of the business this campaign belongs to', required: false })
  @IsUUID()
  @IsOptional()
  businessId?: string;
}

export class UpdateCampaignDto extends CreateCampaignDto {
  @ApiProperty({ enum: CampaignStatus, description: 'Status of the campaign' })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;
}

export class AddProductToCampaignDto {
  @ApiProperty({ description: 'ID of the product to add' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Commission rate for this product in the campaign', required: false })
  @IsNumber()
  @IsOptional()
  commissionRate?: number;
}

export class InviteCollaboratorDto {
  @ApiProperty({ description: 'ID of the user to invite' })
  @IsUUID()
  userId: string;

  @ApiProperty({ 
    description: 'Role for the collaborator', 
    enum: CampaignCollaboratorRole,
    default: CampaignCollaboratorRole.CONTRIBUTOR
  })
  @IsEnum(CampaignCollaboratorRole)
  @IsOptional()
  role?: CampaignCollaboratorRole;
}

export class UpdateCollaboratorStatusDto {
  @ApiProperty({ 
    description: 'New status for the collaboration',
    enum: ['ACCEPTED', 'REJECTED']
  })
  @IsString()
  status: 'ACCEPTED' | 'REJECTED';
}

export class UpdateCampaignProductDto {
  @ApiProperty({ 
    description: 'New status for the product in campaign',
    enum: CampaignProductStatus,
    required: false
  })
  @IsEnum(CampaignProductStatus)
  @IsOptional()
  status?: CampaignProductStatus;

  @ApiProperty({ description: 'Commission rate for this product', required: false })
  @IsNumber()
  @IsOptional()
  commissionRate?: number;

  @ApiProperty({ description: 'Notes about this product in the campaign', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
