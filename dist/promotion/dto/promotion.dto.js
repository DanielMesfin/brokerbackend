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
exports.PromotionResponseDto = exports.UpdatePromotionDto = exports.CreatePromotionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreatePromotionDto {
    constructor() {
        this.isActive = true;
    }
}
exports.CreatePromotionDto = CreatePromotionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Summer Sale', description: 'Title of the promotion' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Get 50% off on all summer collections', description: 'Detailed description of the promotion', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/promotion.jpg', description: 'URL to promotion image', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-06-01T00:00:00.000Z', description: 'Start date of the promotion' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreatePromotionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-08-31T23:59:59.000Z', description: 'End date of the promotion' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreatePromotionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the promotion is currently active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePromotionDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Maximum number of claims allowed for this promotion' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "maxClaims", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Points required to claim this promotion' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "pointsCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'FASHION',
        description: 'Category of the promotion',
        enum: client_1.PromotionCategory
    }),
    (0, class_validator_1.IsEnum)(client_1.PromotionCategory),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'ID of the business that owns this promotion'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "businessId", void 0);
class UpdatePromotionDto {
}
exports.UpdatePromotionDto = UpdatePromotionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePromotionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePromotionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePromotionDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePromotionDto.prototype, "maxClaims", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePromotionDto.prototype, "pointsCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.PromotionCategory }),
    (0, class_validator_1.IsEnum)(client_1.PromotionCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "category", void 0);
class PromotionResponseDto {
}
exports.PromotionResponseDto = PromotionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Summer Sale' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Get 50% off on all summer collections' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/promotion.jpg' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-06-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-08-31T23:59:59.000Z' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PromotionResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PromotionResponseDto.prototype, "maxClaims", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], PromotionResponseDto.prototype, "currentClaims", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PromotionResponseDto.prototype, "pointsCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PromotionCategory, example: 'FASHION' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-05-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-05-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=promotion.dto.js.map