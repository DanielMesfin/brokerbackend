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
exports.OAuth2LoginResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OAuth2LoginResponseDto {
}
exports.OAuth2LoginResponseDto = OAuth2LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT access token for authenticated requests',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], OAuth2LoginResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User information',
        type: 'object',
        properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            email: { type: 'string', example: 'user@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg' },
            isEmailVerified: { type: 'boolean', example: true },
            role: {
                type: 'string',
                enum: ['USER', 'ADMIN', 'MODERATOR', 'PREMIUM', 'BUSINESS_OWNER', 'INFLUENCER'],
                example: 'USER'
            },
        },
    }),
    __metadata("design:type", Object)
], OAuth2LoginResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration time of the access token in seconds',
        example: 3600,
    }),
    __metadata("design:type", Number)
], OAuth2LoginResponseDto.prototype, "expiresIn", void 0);
//# sourceMappingURL=oauth2-login-response.dto.js.map