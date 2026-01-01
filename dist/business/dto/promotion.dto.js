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
const promotion_entity_1 = require("../entities/promotion.entity");
class CreatePromotionDto {
}
exports.CreatePromotionDto = CreatePromotionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promotion name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promotion description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: promotion_entity_1.PromotionType, description: 'Type of promotion' }),
    (0, class_validator_1.IsEnum)(promotion_entity_1.PromotionType),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount value (percentage or fixed amount)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promotion code (unique identifier)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date of the promotion', type: 'string', format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreatePromotionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date of the promotion', type: 'string', format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreatePromotionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum number of times this promotion can be used (0 for unlimited)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "maxUses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum discount amount (for percentage discounts)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum order amount required to apply this promotion' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePromotionDto.prototype, "minOrderAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the promotion is active' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePromotionDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'List of business IDs this promotion applies to (empty for all)' }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePromotionDto.prototype, "businessIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePromotionDto.prototype, "metadata", void 0);
class UpdatePromotionDto {
}
exports.UpdatePromotionDto = UpdatePromotionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Promotion name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Promotion description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: promotion_entity_1.PromotionStatus, description: 'Status of the promotion' }),
    (0, class_validator_1.IsEnum)(promotion_entity_1.PromotionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePromotionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount value (percentage or fixed amount)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePromotionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date of the promotion', type: 'string', format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePromotionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum number of times this promotion can be used' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePromotionDto.prototype, "maxUses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the promotion is active' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePromotionDto.prototype, "isActive", void 0);
class PromotionResponseDto {
}
exports.PromotionResponseDto = PromotionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promotion ID' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promotion name' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promotion description' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: promotion_entity_1.PromotionType, description: 'Type of promotion' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount value' }),
    __metadata("design:type", Number)
], PromotionResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promotion code' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', type: 'string', format: 'date-time' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date', type: 'string', format: 'date-time' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current usage count' }),
    __metadata("design:type", Number)
], PromotionResponseDto.prototype, "usageCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum usage limit' }),
    __metadata("design:type", Number)
], PromotionResponseDto.prototype, "maxUses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum discount amount' }),
    __metadata("design:type", Object)
], PromotionResponseDto.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum order amount' }),
    __metadata("design:type", Number)
], PromotionResponseDto.prototype, "minOrderAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: promotion_entity_1.PromotionStatus, description: 'Current status' }),
    __metadata("design:type", String)
], PromotionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp', type: 'string', format: 'date-time' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp', type: 'string', format: 'date-time' }),
    __metadata("design:type", Date)
], PromotionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=promotion.dto.js.map