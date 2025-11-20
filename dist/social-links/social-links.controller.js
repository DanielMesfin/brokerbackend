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
exports.SocialLinksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const social_links_service_1 = require("./social-links.service");
const create_social_links_dto_1 = require("./dto/create-social-links.dto");
const update_social_links_dto_1 = require("./dto/update-social-links.dto");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
class SocialLinksResponse {
}
let SocialLinksController = class SocialLinksController {
    constructor(socialLinksService) {
        this.socialLinksService = socialLinksService;
    }
    create(user, dto) {
        return this.socialLinksService.create(user.id, dto);
    }
    findMine(user) {
        return this.socialLinksService.findByUserId(user.id);
    }
    updateMine(user, dto) {
        return this.socialLinksService.findByUserIdAndUpdate(user.id, dto);
    }
    findOne(id) {
        return this.socialLinksService.findOne(id);
    }
    update(id, dto) {
        return this.socialLinksService.update(id, dto);
    }
    remove(id) {
        return this.socialLinksService.remove(id);
    }
};
exports.SocialLinksController = SocialLinksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create social links for the current user' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Social links created', type: SocialLinksResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Social links already exist for this user' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'User profile not found' }),
    (0, swagger_1.ApiBody)({ description: 'Social links payload', type: create_social_links_dto_1.CreateSocialLinksDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_social_links_dto_1.CreateSocialLinksDto]),
    __metadata("design:returntype", void 0)
], SocialLinksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user social links' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Returns current user social links', type: SocialLinksResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'User profile not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocialLinksController.prototype, "findMine", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user social links' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Updated social links', type: SocialLinksResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'User profile or social links not found' }),
    (0, swagger_1.ApiBody)({ description: 'Partial update payload', type: update_social_links_dto_1.UpdateSocialLinksDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_social_links_dto_1.UpdateSocialLinksDto]),
    __metadata("design:returntype", void 0)
], SocialLinksController.prototype, "updateMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get social links by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Social links ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Returns social links', type: SocialLinksResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Social links not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocialLinksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update social links by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Social links ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Updated social links', type: SocialLinksResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Social links not found' }),
    (0, swagger_1.ApiBody)({ description: 'Partial update payload', type: update_social_links_dto_1.UpdateSocialLinksDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_social_links_dto_1.UpdateSocialLinksDto]),
    __metadata("design:returntype", void 0)
], SocialLinksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete social links by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Social links ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Deletion success message' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Social links not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocialLinksController.prototype, "remove", null);
exports.SocialLinksController = SocialLinksController = __decorate([
    (0, swagger_1.ApiTags)('Social Links'),
    (0, common_1.Controller)('api/social-links'),
    __metadata("design:paramtypes", [social_links_service_1.SocialLinksService])
], SocialLinksController);
//# sourceMappingURL=social-links.controller.js.map