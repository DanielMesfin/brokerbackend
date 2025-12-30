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
exports.ComplianceRequirementUpdateDto = exports.DocumentUploadResponseDto = exports.BusinessStatsResponseDto = exports.BusinessQueryDto = exports.SuspendBusinessDto = exports.BusinessResponseDto = exports.BusinessComplianceDto = exports.ComplianceRequirementDto = exports.BusinessVerificationDto = exports.BusinessDocumentDto = exports.UpdateBusinessDto = exports.CreateBusinessDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const business_entity_1 = require("../entities/business.entity");
const business_document_entity_1 = require("../entities/business-document.entity");
const business_verification_entity_1 = require("../entities/business-verification.entity");
const business_compliance_entity_1 = require("../entities/business-compliance.entity");
class CreateBusinessDto {
}
exports.CreateBusinessDto = CreateBusinessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Legal business name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "legalName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trading name (if different from legal name)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "tradeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: business_entity_1.BusinessType, description: 'Type of business entity' }),
    (0, class_validator_1.IsEnum)(business_entity_1.BusinessType),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Industry or business category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business registration number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax identification number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "taxIdentificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'State/Province/Region' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal/ZIP code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of business establishment', type: 'string', format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateBusinessDto.prototype, "establishmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of business owner/representative' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "ownerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "ownerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact phone number' }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "ownerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business website URL' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "website", void 0);
class UpdateBusinessDto {
}
exports.UpdateBusinessDto = UpdateBusinessDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Legal business name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "legalName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trading name (if different from legal name)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "tradeName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: business_entity_1.BusinessType, description: 'Type of business entity' }),
    (0, class_validator_1.IsEnum)(business_entity_1.BusinessType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Industry or business category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'State/Province/Region' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal/ZIP code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "ownerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact phone number' }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "ownerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business website URL' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: business_entity_1.BusinessStatus, description: 'Business status' }),
    (0, class_validator_1.IsEnum)(business_entity_1.BusinessStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for suspension' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessDto.prototype, "suspensionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Suspension timestamp', type: 'string', format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateBusinessDto.prototype, "suspendedAt", void 0);
class BusinessDocumentDto {
}
exports.BusinessDocumentDto = BusinessDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document type' }),
    (0, class_validator_1.IsEnum)(business_document_entity_1.DocumentType),
    __metadata("design:type", String)
], BusinessDocumentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessDocumentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to the document file' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessDocumentDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type of the document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessDocumentDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BusinessDocumentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document issue date', type: 'string', format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BusinessDocumentDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document expiry date', type: 'string', format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BusinessDocumentDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: business_document_entity_1.DocumentStatus, description: 'Document verification status' }),
    (0, class_validator_1.IsEnum)(business_document_entity_1.DocumentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDocumentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for rejection if applicable' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDocumentDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'object',
        description: 'Additional metadata',
        additionalProperties: true
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BusinessDocumentDto.prototype, "metadata", void 0);
class BusinessVerificationDto {
}
exports.BusinessVerificationDto = BusinessVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: business_verification_entity_1.VerificationStatus, description: 'Verification status' }),
    (0, class_validator_1.IsEnum)(business_verification_entity_1.VerificationStatus),
    __metadata("design:type", String)
], BusinessVerificationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: business_verification_entity_1.VerificationMethod, description: 'Verification method used' }),
    (0, class_validator_1.IsEnum)(business_verification_entity_1.VerificationMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessVerificationDto.prototype, "verificationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for rejection if applicable' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessVerificationDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'object',
        description: 'Additional verification data',
        additionalProperties: true
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BusinessVerificationDto.prototype, "verificationData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the user who performed verification' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessVerificationDto.prototype, "verifiedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of the verifier' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessVerificationDto.prototype, "verifiedByName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification timestamp', type: 'string', format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BusinessVerificationDto.prototype, "verifiedAt", void 0);
class ComplianceRequirementDto {
}
exports.ComplianceRequirementDto = ComplianceRequirementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the requirement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceRequirementDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the requirement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceRequirementDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the requirement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceRequirementDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: business_compliance_entity_1.ComplianceRequirementStatus, description: 'Status of the requirement' }),
    (0, class_validator_1.IsEnum)(business_compliance_entity_1.ComplianceRequirementStatus),
    __metadata("design:type", String)
], ComplianceRequirementDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this requirement is mandatory' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ComplianceRequirementDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Due date for this requirement', type: 'string', format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], ComplianceRequirementDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification timestamp', type: 'string', format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], ComplianceRequirementDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the user who verified this requirement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ComplianceRequirementDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ComplianceRequirementDto.prototype, "notes", void 0);
class BusinessComplianceDto {
}
exports.BusinessComplianceDto = BusinessComplianceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: business_compliance_entity_1.ComplianceStatus, description: 'Overall compliance status' }),
    (0, class_validator_1.IsEnum)(business_compliance_entity_1.ComplianceStatus),
    __metadata("design:type", String)
], BusinessComplianceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Compliance score (0-100)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], BusinessComplianceDto.prototype, "complianceScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ComplianceRequirementDto], description: 'List of compliance requirements' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ComplianceRequirementDto),
    __metadata("design:type", Array)
], BusinessComplianceDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BusinessComplianceDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of next compliance audit', type: 'string', format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BusinessComplianceDto.prototype, "nextAuditDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the business is currently suspended' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BusinessComplianceDto.prototype, "isSuspended", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for suspension if applicable', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BusinessComplianceDto.prototype, "suspensionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Suspension timestamp', type: 'string', format: 'date-time', nullable: true }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BusinessComplianceDto.prototype, "suspendedAt", void 0);
class BusinessResponseDto {
}
exports.BusinessResponseDto = BusinessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business ID' }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Legal business name' }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "legalName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trading name (if different from legal name)' }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "tradeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: business_entity_1.BusinessType, description: 'Type of business entity' }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business status' }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business verification details' }),
    __metadata("design:type", BusinessVerificationDto)
], BusinessResponseDto.prototype, "verification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business compliance details' }),
    __metadata("design:type", BusinessComplianceDto)
], BusinessResponseDto.prototype, "compliance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BusinessDocumentDto], description: 'Business documents' }),
    __metadata("design:type", Array)
], BusinessResponseDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp', type: 'string', format: 'date-time' }),
    __metadata("design:type", Date)
], BusinessResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp', type: 'string', format: 'date-time' }),
    __metadata("design:type", Date)
], BusinessResponseDto.prototype, "updatedAt", void 0);
class SuspendBusinessDto {
}
exports.SuspendBusinessDto = SuspendBusinessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for suspension' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SuspendBusinessDto.prototype, "reason", void 0);
class BusinessQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = 'createdAt';
        this.sortOrder = 'DESC';
    }
}
exports.BusinessQueryDto = BusinessQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: business_entity_1.BusinessStatus,
        isArray: true,
        description: 'Filter by business status'
    }),
    (0, class_validator_1.IsEnum)(business_entity_1.BusinessStatus, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BusinessQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: business_compliance_entity_1.ComplianceStatus,
        isArray: true,
        description: 'Filter by compliance status'
    }),
    (0, class_validator_1.IsEnum)(business_compliance_entity_1.ComplianceStatus, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BusinessQueryDto.prototype, "complianceStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: business_verification_entity_1.VerificationStatus,
        isArray: true,
        description: 'Filter by verification status'
    }),
    (0, class_validator_1.IsEnum)(business_verification_entity_1.VerificationStatus, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BusinessQueryDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search term for business name, registration number, etc.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number for pagination', default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BusinessQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of items per page', default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BusinessQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['createdAt', 'updatedAt', 'legalName', 'complianceScore'],
        description: 'Field to sort by',
        default: 'createdAt'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['ASC', 'DESC'],
        description: 'Sort order',
        default: 'DESC'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessQueryDto.prototype, "sortOrder", void 0);
class BusinessStatsResponseDto {
}
exports.BusinessStatsResponseDto = BusinessStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of businesses' }),
    __metadata("design:type", Number)
], BusinessStatsResponseDto.prototype, "totalBusinesses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of verified businesses' }),
    __metadata("design:type", Number)
], BusinessStatsResponseDto.prototype, "verifiedBusinesses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of businesses pending verification' }),
    __metadata("design:type", Number)
], BusinessStatsResponseDto.prototype, "pendingVerification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of non-compliant businesses' }),
    __metadata("design:type", Number)
], BusinessStatsResponseDto.prototype, "nonCompliant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Overall compliance rate (0-100)' }),
    __metadata("design:type", Number)
], BusinessStatsResponseDto.prototype, "complianceRate", void 0);
class DocumentUploadResponseDto {
}
exports.DocumentUploadResponseDto = DocumentUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document ID' }),
    __metadata("design:type", String)
], DocumentUploadResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document name' }),
    __metadata("design:type", String)
], DocumentUploadResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: business_document_entity_1.DocumentType, description: 'Type of document' }),
    __metadata("design:type", String)
], DocumentUploadResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to access the document' }),
    __metadata("design:type", String)
], DocumentUploadResponseDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document status' }),
    __metadata("design:type", String)
], DocumentUploadResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Upload timestamp', type: 'string', format: 'date-time' }),
    __metadata("design:type", Date)
], DocumentUploadResponseDto.prototype, "uploadedAt", void 0);
class ComplianceRequirementUpdateDto {
}
exports.ComplianceRequirementUpdateDto = ComplianceRequirementUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the requirement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceRequirementUpdateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the requirement' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceRequirementUpdateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this requirement is mandatory' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ComplianceRequirementUpdateDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Due date for this requirement',
        type: 'string',
        format: 'date'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], ComplianceRequirementUpdateDto.prototype, "dueDate", void 0);
//# sourceMappingURL=business.dto.js.map