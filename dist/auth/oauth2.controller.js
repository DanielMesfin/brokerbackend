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
exports.OAuth2Controller = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const oauth2_login_response_dto_1 = require("./dto/oauth2-login-response.dto");
let OAuth2Controller = class OAuth2Controller {
    constructor(authService, jwtService, configService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async googleAuth() {
    }
    async googleAuthCallback(req) {
        const user = req.user;
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'USER',
        });
        return {
            url: `${frontendUrl}/auth/callback?token=${token}`,
        };
    }
    async facebookAuth() {
    }
    async facebookAuthCallback(req) {
        return this.googleAuthCallback(req);
    }
};
exports.OAuth2Controller = OAuth2Controller;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Google OAuth2 login' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FOUND, description: 'Redirects to Google OAuth2 consent screen' }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, common_1.Redirect)(),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth2 callback URL' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FOUND,
        description: 'Redirects to frontend with JWT token',
        type: oauth2_login_response_dto_1.OAuth2LoginResponseDto,
    }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Get)('facebook'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Facebook OAuth2 login' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FOUND, description: 'Redirects to Facebook OAuth2 consent screen' }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "facebookAuth", null);
__decorate([
    (0, common_1.Get)('facebook/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    (0, common_1.Redirect)(),
    (0, swagger_1.ApiOperation)({ summary: 'Facebook OAuth2 callback URL' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FOUND,
        description: 'Redirects to frontend with JWT token',
        type: oauth2_login_response_dto_1.OAuth2LoginResponseDto,
    }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "facebookAuthCallback", null);
exports.OAuth2Controller = OAuth2Controller = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        config_1.ConfigService])
], OAuth2Controller);
//# sourceMappingURL=oauth2.controller.js.map