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
exports.BusinessProfileResponseDto = exports.UpdateBusinessProfileDto = exports.CreateBusinessProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateBusinessProfileDto {
}
exports.CreateBusinessProfileDto = CreateBusinessProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme Corp', description: 'The name of the business' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessProfileDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Leading provider of innovative solutions', description: 'Business description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Technology', description: 'Industry sector' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessProfileDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York, USA', description: 'Business location', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessProfileDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://acmecorp.com', description: 'Business website', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/logo.png', description: 'URL to business logo', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessProfileDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['CO_MARKETING', 'TECH_PARTNERSHIP'],
        description: 'Types of collaborations the business is interested in',
        enum: client_1.CollaborationType,
        isArray: true,
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.CollaborationType, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateBusinessProfileDto.prototype, "collaborationTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Increase brand awareness', description: 'Business goals', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessProfileDto.prototype, "goals", void 0);
class UpdateBusinessProfileDto {
}
exports.UpdateBusinessProfileDto = UpdateBusinessProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessProfileDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessProfileDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessProfileDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessProfileDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.CollaborationType, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateBusinessProfileDto.prototype, "collaborationTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBusinessProfileDto.prototype, "goals", void 0);
class BusinessProfileResponseDto {
}
exports.BusinessProfileResponseDto = BusinessProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme Corp' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Leading provider of innovative solutions' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Technology' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York, USA' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://acmecorp.com' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/logo.png' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['CO_MARKETING', 'TECH_PARTNERSHIP'],
        enum: client_1.CollaborationType,
        isArray: true
    }),
    __metadata("design:type", Array)
], BusinessProfileResponseDto.prototype, "collaborationTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Increase brand awareness' }),
    __metadata("design:type", String)
], BusinessProfileResponseDto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], BusinessProfileResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], BusinessProfileResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=business-profile.dto.js.map