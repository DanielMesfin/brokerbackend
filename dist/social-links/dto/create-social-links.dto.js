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
exports.CreateSocialLinksDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSocialLinksDto {
}
exports.CreateSocialLinksDto = CreateSocialLinksDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Facebook profile URL',
        example: 'https://facebook.com/username',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Facebook URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "facebookUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Instagram profile URL',
        example: 'https://instagram.com/username',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Instagram URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "instagramUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'TikTok profile URL',
        example: 'https://tiktok.com/@username',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'TikTok URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "tiktokUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'YouTube channel URL',
        example: 'https://youtube.com/channel/UC...',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'YouTube URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "youtubeUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'LinkedIn profile URL',
        example: 'https://linkedin.com/in/username',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'LinkedIn URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Twitter/X profile URL',
        example: 'https://twitter.com/username',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Twitter URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "twitterUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Telegram profile URL',
        example: 'https://t.me/username',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Telegram URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "telegramUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'WhatsApp phone number for click-to-chat',
        example: '+1234567890',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)(undefined, { message: 'Invalid WhatsApp number' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Personal or business website URL',
        example: 'https://example.com',
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Website URL must be a valid URL' }),
    __metadata("design:type", String)
], CreateSocialLinksDto.prototype, "websiteUrl", void 0);
//# sourceMappingURL=create-social-links.dto.js.map