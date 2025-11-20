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
exports.MarketingSalesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const marketing_sales_service_1 = require("./marketing-sales.service");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const listing_entity_1 = require("./entities/listing.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_role_enum_1 = require("../users/user-role.enum");
let MarketingSalesController = class MarketingSalesController {
    constructor(marketingSalesService) {
        this.marketingSalesService = marketingSalesService;
    }
    async createListing(req, createListingDto) {
        return this.marketingSalesService.createListing(req.user.userId, createListingDto);
    }
    async findAllListings(status) {
        return this.marketingSalesService.findAllListings(status);
    }
    async searchListings(query, category, type, minPrice, maxPrice) {
        const filters = {
            ...(category && { category }),
            ...(type && { type }),
            ...(minPrice && { minPrice }),
            ...(maxPrice && { maxPrice }),
        };
        return this.marketingSalesService.searchListings(query || '', filters);
    }
    async findOneListing(id) {
        return this.marketingSalesService.findListingById(id);
    }
    async updateListing(id, req, updateListingDto) {
        return this.marketingSalesService.updateListing(id, updateListingDto, req.user.userId, req.user.role === user_role_enum_1.UserRole.ADMIN);
    }
    async removeListing(id, req) {
        return this.marketingSalesService.removeListing(id, req.user.userId, req.user.role === user_role_enum_1.UserRole.ADMIN);
    }
    async updateListingStatus(id, status, req) {
        if (!['PENDING', 'APPROVED', 'REJECTED', 'SOLD'].includes(status)) {
            throw new common_1.BadRequestException('Invalid status');
        }
        return this.marketingSalesService.updateListingStatus(id, status, req.user.userId);
    }
};
exports.MarketingSalesController = MarketingSalesController;
__decorate([
    (0, common_1.Post)('listings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.USER, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new listing',
        description: 'Create a new product or service listing. For B2B listings, additional business verification may be required.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The listing has been successfully created.'
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data',
        schema: {
            example: {
                statusCode: 400,
                message: ['Validation error details'],
                error: 'Bad Request'
            }
        }
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'User does not have permission to create this type of listing',
    }),
    (0, swagger_1.ApiBody)({
        type: create_listing_dto_1.CreateListingDto,
        examples: {
            b2b: {
                summary: 'B2B Listing Example',
                value: {
                    title: 'Bulk Office Chairs - Wholesale',
                    description: 'Premium ergonomic office chairs available for wholesale purchase. MOQ: 50 units.',
                    type: 'B2B',
                    price: 199.99,
                    category: 'Office Furniture',
                    tags: ['office', 'chairs', 'ergonomic', 'bulk'],
                    commissionRate: 5,
                    isNegotiable: true,
                    minOrder: 10,
                    maxOrder: 1000,
                    leadTime: '2-3 weeks'
                }
            },
            b2c: {
                summary: 'B2C Listing Example',
                value: {
                    title: 'Single Office Chair - Retail',
                    description: 'Comfortable office chair for home use',
                    type: 'B2C',
                    price: 249.99,
                    category: 'Home Office',
                    tags: ['home', 'office', 'chair'],
                    isNegotiable: false
                }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_listing_dto_1.CreateListingDto]),
    __metadata("design:returntype", Promise)
], MarketingSalesController.prototype, "createListing", null);
__decorate([
    (0, common_1.Get)('listings'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all listings',
        description: 'Retrieve a list of all listings with optional filtering. Supports pagination and filtering by status, type, and category.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SOLD', 'DRAFT', 'EXPIRED'],
        description: 'Filter listings by status'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['B2B', 'B2C', 'C2C', 'B2G'],
        description: 'Filter listings by business type'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        description: 'Filter by category name'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of listings retrieved successfully',
        type: [listing_entity_1.Listing]
    }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingSalesController.prototype, "findAllListings", null);
__decorate([
    (0, common_1.Get)('listings/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search listings' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['C2C', 'B2B', 'B2C'] }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return matching listings.', type: [listing_entity_1.Listing] }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('minPrice')),
    __param(4, (0, common_1.Query)('maxPrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MarketingSalesController.prototype, "searchListings", null);
__decorate([
    (0, common_1.Get)('listings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a listing by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the listing.', type: listing_entity_1.Listing }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingSalesController.prototype, "findOneListing", null);
__decorate([
    (0, common_1.Put)('listings/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The listing has been successfully updated.', type: listing_entity_1.Listing }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MarketingSalesController.prototype, "updateListing", null);
__decorate([
    (0, common_1.Delete)('listings/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The listing has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MarketingSalesController.prototype, "removeListing", null);
__decorate([
    (0, common_1.Put)('listings/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update listing status (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The listing status has been updated.', type: listing_entity_1.Listing }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MarketingSalesController.prototype, "updateListingStatus", null);
exports.MarketingSalesController = MarketingSalesController = __decorate([
    (0, swagger_1.ApiTags)('Marketing & Sales'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('marketing-sales'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
    __metadata("design:paramtypes", [marketing_sales_service_1.MarketingSalesService])
], MarketingSalesController);
//# sourceMappingURL=marketing-sales.controller.js.map