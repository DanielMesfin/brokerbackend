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
exports.UpdateCampaignProductDto = exports.UpdateCollaboratorStatusDto = exports.InviteCollaboratorDto = exports.AddProductToCampaignDto = exports.UpdateCampaignDto = exports.CreateCampaignDto = exports.CampaignProductStatus = exports.CampaignCollaboratorRole = exports.CampaignStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "DRAFT";
    CampaignStatus["ACTIVE"] = "ACTIVE";
    CampaignStatus["COMPLETED"] = "COMPLETED";
    CampaignStatus["CANCELLED"] = "CANCELLED";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
var CampaignCollaboratorRole;
(function (CampaignCollaboratorRole) {
    CampaignCollaboratorRole["OWNER"] = "OWNER";
    CampaignCollaboratorRole["MANAGER"] = "MANAGER";
    CampaignCollaboratorRole["CONTRIBUTOR"] = "CONTRIBUTOR";
})(CampaignCollaboratorRole || (exports.CampaignCollaboratorRole = CampaignCollaboratorRole = {}));
var CampaignProductStatus;
(function (CampaignProductStatus) {
    CampaignProductStatus["PENDING"] = "PENDING";
    CampaignProductStatus["APPROVED"] = "APPROVED";
    CampaignProductStatus["REJECTED"] = "REJECTED";
})(CampaignProductStatus || (exports.CampaignProductStatus = CampaignProductStatus = {}));
class CreateCampaignDto {
}
exports.CreateCampaignDto = CreateCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the campaign' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the campaign', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date of the campaign (ISO string)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date of the campaign (ISO string)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Budget for the campaign', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCampaignDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target audience description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "targetAudience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the business this campaign belongs to', required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "businessId", void 0);
class UpdateCampaignDto extends CreateCampaignDto {
}
exports.UpdateCampaignDto = UpdateCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CampaignStatus, description: 'Status of the campaign' }),
    (0, class_validator_1.IsEnum)(CampaignStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "status", void 0);
class AddProductToCampaignDto {
}
exports.AddProductToCampaignDto = AddProductToCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the product to add' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddProductToCampaignDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Commission rate for this product in the campaign', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AddProductToCampaignDto.prototype, "commissionRate", void 0);
class InviteCollaboratorDto {
}
exports.InviteCollaboratorDto = InviteCollaboratorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user to invite' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InviteCollaboratorDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role for the collaborator',
        enum: CampaignCollaboratorRole,
        default: CampaignCollaboratorRole.CONTRIBUTOR
    }),
    (0, class_validator_1.IsEnum)(CampaignCollaboratorRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InviteCollaboratorDto.prototype, "role", void 0);
class UpdateCollaboratorStatusDto {
}
exports.UpdateCollaboratorStatusDto = UpdateCollaboratorStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status for the collaboration',
        enum: ['ACCEPTED', 'REJECTED']
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCollaboratorStatusDto.prototype, "status", void 0);
class UpdateCampaignProductDto {
}
exports.UpdateCampaignProductDto = UpdateCampaignProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status for the product in campaign',
        enum: CampaignProductStatus,
        required: false
    }),
    (0, class_validator_1.IsEnum)(CampaignProductStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Commission rate for this product', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCampaignProductDto.prototype, "commissionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notes about this product in the campaign', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignProductDto.prototype, "notes", void 0);
//# sourceMappingURL=campaign.dto.js.map