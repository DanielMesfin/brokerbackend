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
exports.VerificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const verification_service_1 = require("./verification.service");
const verify_user_dto_1 = require("./dto/verify-user.dto");
let VerificationController = class VerificationController {
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    async sendVerificationEmail(email) {
        const user = await this.verificationService.findUserByEmail(email);
        if (!user) {
            return { status: common_1.HttpStatus.NOT_FOUND, message: 'User not found' };
        }
        const code = await this.verificationService.generateVerificationCode(user.id, verification_service_1.VerificationType.EMAIL);
        await this.verificationService.sendVerificationEmail(email, code);
        return { status: common_1.HttpStatus.OK, message: 'Verification email sent' };
    }
    async verifyUser(verifyUserDto) {
        const isValid = await this.verificationService.verifyCode(verifyUserDto.userId, verifyUserDto.verificationCode, verification_service_1.VerificationType.EMAIL);
        if (!isValid) {
            return { status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid or expired verification code' };
        }
        return { status: common_1.HttpStatus.OK, message: 'User verified successfully' };
    }
};
exports.VerificationController = VerificationController;
__decorate([
    (0, common_1.Post)('send-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Send verification email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification email sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
            },
        },
    }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "sendVerificationEmail", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify user with code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired verification code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_user_dto_1.VerifyUserDto]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "verifyUser", null);
exports.VerificationController = VerificationController = __decorate([
    (0, swagger_1.ApiTags)('verification'),
    (0, common_1.Controller)('verification'),
    __metadata("design:paramtypes", [verification_service_1.VerificationService])
], VerificationController);
//# sourceMappingURL=verification.controller.js.map