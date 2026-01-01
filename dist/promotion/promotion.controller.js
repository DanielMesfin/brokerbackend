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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const promotion_service_1 = require("./promotion.service");
const promotion_dto_1 = require("./dto/promotion.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_role_enum_1 = require("../users/user-role.enum");
let PromotionController = class PromotionController {
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    async create(createPromotionDto) {
        return this.promotionService.create(createPromotionDto);
    }
    async findAll(category, isActive, businessId) {
        return this.promotionService.findAll({
            category: category,
            isActive,
            businessId
        });
    }
    async findOne(id) {
        return this.promotionService.findOne(id);
    }
    async update(id, updatePromotionDto) {
        return this.promotionService.update(id, updatePromotionDto);
    }
    async remove(id) {
        return this.promotionService.remove(id);
    }
    async claimPromotion(id, req) {
        const userId = req.user.id;
        return this.promotionService.claimPromotion(id, userId);
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUSINESS_OWNER, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new promotion' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The promotion has been successfully created.',
        type: promotion_dto_1.PromotionResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [promotion_dto_1.CreatePromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all promotions' }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: ['FOOD', 'FASHION', 'ELECTRONICS', 'BEAUTY', 'HOME', 'SPORTS', 'TRAVEL', 'OTHER'],
        description: 'Filter by promotion category'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        type: Boolean,
        description: 'Filter by active status'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'businessId',
        required: false,
        type: String,
        description: 'Filter by business ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Returns a list of promotions',
        type: [promotion_dto_1.PromotionResponseDto]
    }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get promotion by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Promotion ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Returns the promotion with the specified ID',
        type: promotion_dto_1.PromotionResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Promotion not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUSINESS_OWNER, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a promotion' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Promotion ID' }),
    (0, swagger_1.ApiBody)({ type: promotion_dto_1.UpdatePromotionDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The promotion has been successfully updated.',
        type: promotion_dto_1.PromotionResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Promotion not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, promotion_dto_1.UpdatePromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.BUSINESS_OWNER, user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a promotion' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Promotion ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The promotion has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Promotion not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/claim'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Claim a promotion' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Promotion ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The promotion has been successfully claimed.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Promotion not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Promotion not available or already claimed'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "claimPromotion", null);
exports.PromotionController = PromotionController = __decorate([
    (0, swagger_1.ApiTags)('Promotions'),
    (0, common_1.Controller)('api/promotions'),
    __metadata("design:paramtypes", [promotion_service_1.PromotionService])
], PromotionController);
//# sourceMappingURL=promotion.controller.js.map