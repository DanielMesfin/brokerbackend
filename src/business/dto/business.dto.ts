import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsEmail, IsPhoneNumber, IsUrl, IsBoolean, IsNumber, IsArray, ValidateNested, IsDateString, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessType, BusinessStatus } from '../entities/business.entity';
import { DocumentType, DocumentStatus } from '../entities/business-document.entity';
import { VerificationStatus, VerificationMethod } from '../entities/business-verification.entity';
import { ComplianceStatus, ComplianceRequirementStatus } from '../entities/business-compliance.entity';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Legal business name' })
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @ApiPropertyOptional({ description: 'Trading name (if different from legal name)' })
  @IsString()
  @IsOptional()
  tradeName?: string;

  @ApiProperty({ enum: BusinessType, description: 'Type of business entity' })
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @ApiProperty({ description: 'Industry or business category' })
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ description: 'Business registration number' })
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty({ description: 'Tax identification number' })
  @IsString()
  @IsNotEmpty()
  taxIdentificationNumber: string;

  @ApiProperty({ description: 'Business address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province/Region' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Date of business establishment', type: 'string', format: 'date' })
  @IsDateString()
  @IsOptional()
  establishmentDate?: Date;

  @ApiProperty({ description: 'Full name of business owner/representative' })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({ description: 'Contact email address' })
  @IsEmail()
  @IsNotEmpty()
  ownerEmail: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsPhoneNumber()
  @IsNotEmpty()
  ownerPhone: string;

  @ApiPropertyOptional({ description: 'Business website URL' })
  @IsUrl()
  @IsOptional()
  website?: string;
}

export class UpdateBusinessDto {
  @ApiPropertyOptional({ description: 'Legal business name' })
  @IsString()
  @IsOptional()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Trading name (if different from legal name)' })
  @IsString()
  @IsOptional()
  tradeName?: string;

  @ApiPropertyOptional({ enum: BusinessType, description: 'Type of business entity' })
  @IsEnum(BusinessType)
  @IsOptional()
  businessType?: BusinessType;

  @ApiPropertyOptional({ description: 'Industry or business category' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ description: 'Business address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province/Region' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Contact email address' })
  @IsEmail()
  @IsOptional()
  ownerEmail?: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsPhoneNumber()
  @IsOptional()
  ownerPhone?: string;

  @ApiPropertyOptional({ description: 'Business website URL' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ enum: BusinessStatus, description: 'Business status' })
  @IsEnum(BusinessStatus)
  @IsOptional()
  status?: BusinessStatus;

  @ApiPropertyOptional({ description: 'Reason for suspension' })
  @IsString()
  @IsOptional()
  suspensionReason?: string;

  @ApiPropertyOptional({ description: 'Suspension timestamp', type: 'string', format: 'date-time' })
  @IsDateString()
  @IsOptional()
  suspendedAt?: Date;
}

export class BusinessDocumentDto {
  @ApiProperty({ description: 'Document type' })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ description: 'Document name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'URL to the document file' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: 'MIME type of the document' })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  fileSize: number;

  @ApiPropertyOptional({ description: 'Document issue date', type: 'string', format: 'date' })
  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @ApiPropertyOptional({ description: 'Document expiry date', type: 'string', format: 'date' })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;

  @ApiPropertyOptional({ enum: DocumentStatus, description: 'Document verification status' })
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @ApiPropertyOptional({ description: 'Reason for rejection if applicable' })
  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @ApiPropertyOptional({ 
    type: 'object', 
    description: 'Additional metadata',
    additionalProperties: true 
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class BusinessVerificationDto {
  @ApiProperty({ enum: VerificationStatus, description: 'Verification status' })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiPropertyOptional({ enum: VerificationMethod, description: 'Verification method used' })
  @IsEnum(VerificationMethod)
  @IsOptional()
  verificationMethod?: VerificationMethod;

  @ApiPropertyOptional({ description: 'Reason for rejection if applicable' })
  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @ApiPropertyOptional({ 
    type: 'object', 
    description: 'Additional verification data',
    additionalProperties: true 
  })
  @IsObject()
  @IsOptional()
  verificationData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'ID of the user who performed verification' })
  @IsString()
  @IsOptional()
  verifiedById?: string;

  @ApiPropertyOptional({ description: 'Name of the verifier' })
  @IsString()
  @IsOptional()
  verifiedByName?: string;

  @ApiPropertyOptional({ description: 'Verification timestamp', type: 'string', format: 'date-time' })
  @IsDateString()
  @IsOptional()
  verifiedAt?: Date;
}

export class ComplianceRequirementDto {
  @ApiProperty({ description: 'Unique identifier for the requirement' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Name of the requirement' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the requirement' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ComplianceRequirementStatus, description: 'Status of the requirement' })
  @IsEnum(ComplianceRequirementStatus)
  status: ComplianceRequirementStatus;

  @ApiProperty({ description: 'Whether this requirement is mandatory' })
  @IsBoolean()
  required: boolean;

  @ApiPropertyOptional({ description: 'Due date for this requirement', type: 'string', format: 'date' })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'Verification timestamp', type: 'string', format: 'date-time' })
  @IsDateString()
  @IsOptional()
  verifiedAt?: Date;

  @ApiPropertyOptional({ description: 'ID of the user who verified this requirement' })
  @IsString()
  @IsOptional()
  verifiedBy?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class BusinessComplianceDto {
  @ApiProperty({ enum: ComplianceStatus, description: 'Overall compliance status' })
  @IsEnum(ComplianceStatus)
  status: ComplianceStatus;

  @ApiProperty({ description: 'Compliance score (0-100)' })
  @IsNumber()
  @IsNotEmpty()
  complianceScore: number;

  @ApiProperty({ type: [ComplianceRequirementDto], description: 'List of compliance requirements' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComplianceRequirementDto)
  requirements: ComplianceRequirementDto[];

  @ApiProperty({
    type: 'object',
    description: 'Compliance settings',
    additionalProperties: false,
    properties: {
      autoSuspend: { type: 'boolean' },
      notifyDaysBeforeExpiry: { type: 'array', items: { type: 'number' } },
      notifyOn: {
        type: 'object',
        additionalProperties: false,
        properties: {
          email: { type: 'boolean' },
          sms: { type: 'boolean' },
          inApp: { type: 'boolean' }
        }
      },
      gracePeriodDays: { type: 'number' }
    }
  })
  @IsObject()
  settings: {
    autoSuspend: boolean;
    notifyDaysBeforeExpiry: number[];
    notifyOn: {
      email: boolean;
      sms: boolean;
      inApp: boolean;
    };
    gracePeriodDays: number;
  };

  @ApiPropertyOptional({ description: 'Date of next compliance audit', type: 'string', format: 'date' })
  @IsDateString()
  @IsOptional()
  nextAuditDate?: Date;

  @ApiProperty({ description: 'Whether the business is currently suspended' })
  @IsBoolean()
  isSuspended: boolean;

  @ApiPropertyOptional({ description: 'Reason for suspension if applicable', nullable: true })
  @IsString()
  @IsOptional()
  suspensionReason?: string | null;

  @ApiPropertyOptional({ description: 'Suspension timestamp', type: 'string', format: 'date-time', nullable: true })
  @IsDateString()
  @IsOptional()
  suspendedAt?: Date | null;
}

export class BusinessResponseDto {
  @ApiProperty({ description: 'Business ID' })
  id: string;

  @ApiProperty({ description: 'Legal business name' })
  legalName: string;

  @ApiPropertyOptional({ description: 'Trading name (if different from legal name)' })
  tradeName?: string;

  @ApiProperty({ enum: BusinessType, description: 'Type of business entity' })
  businessType: BusinessType;

  @ApiProperty({ description: 'Business status' })
  status: BusinessStatus;

  @ApiProperty({ description: 'Business verification details' })
  verification: BusinessVerificationDto;

  @ApiProperty({ description: 'Business compliance details' })
  compliance: BusinessComplianceDto;

  @ApiProperty({ type: [BusinessDocumentDto], description: 'Business documents' })
  documents: BusinessDocumentDto[];

  @ApiProperty({ description: 'Creation timestamp', type: 'string', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', type: 'string', format: 'date-time' })
  updatedAt: Date;
}

export class SuspendBusinessDto {
  @ApiProperty({ description: 'Reason for suspension' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class BusinessQueryDto {
  @ApiPropertyOptional({ 
    enum: BusinessStatus, 
    isArray: true,
    description: 'Filter by business status' 
  })
  @IsEnum(BusinessStatus, { each: true })
  @IsOptional()
  status?: BusinessStatus[];

  @ApiPropertyOptional({ 
    enum: ComplianceStatus, 
    isArray: true,
    description: 'Filter by compliance status' 
  })
  @IsEnum(ComplianceStatus, { each: true })
  @IsOptional()
  complianceStatus?: ComplianceStatus[];

  @ApiPropertyOptional({ 
    enum: VerificationStatus, 
    isArray: true,
    description: 'Filter by verification status' 
  })
  @IsEnum(VerificationStatus, { each: true })
  @IsOptional()
  verificationStatus?: VerificationStatus[];

  @ApiPropertyOptional({ description: 'Search term for business name, registration number, etc.' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    enum: ['createdAt', 'updatedAt', 'legalName', 'complianceScore'],
    description: 'Field to sort by',
    default: 'createdAt' 
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ 
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
    default: 'DESC' 
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class BusinessStatsResponseDto {
  @ApiProperty({ description: 'Total number of businesses' })
  totalBusinesses: number;

  @ApiProperty({ description: 'Number of verified businesses' })
  verifiedBusinesses: number;

  @ApiProperty({ description: 'Number of businesses pending verification' })
  pendingVerification: number;

  @ApiProperty({ description: 'Number of non-compliant businesses' })
  nonCompliant: number;

  @ApiProperty({ description: 'Overall compliance rate (0-100)' })
  complianceRate: number;
}

export class DocumentUploadResponseDto {
  @ApiProperty({ description: 'Document ID' })
  id: string;

  @ApiProperty({ description: 'Document name' })
  name: string;

  @ApiProperty({ enum: DocumentType, description: 'Type of document' })
  type: DocumentType;

  @ApiProperty({ description: 'URL to access the document' })
  fileUrl: string;

  @ApiProperty({ description: 'Document status' })
  status: DocumentStatus;

  @ApiProperty({ description: 'Upload timestamp', type: 'string', format: 'date-time' })
  uploadedAt: Date;
}

export class ComplianceRequirementUpdateDto {
  @ApiProperty({ description: 'Name of the requirement' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the requirement' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Whether this requirement is mandatory' })
  @IsBoolean()
  required: boolean;

  @ApiPropertyOptional({ 
    description: 'Due date for this requirement',
    type: 'string',
    format: 'date'
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
