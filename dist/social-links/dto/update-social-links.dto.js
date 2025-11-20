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
exports.UpdateSocialLinksDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const create_social_links_dto_1 = require("./create-social-links.dto");
class UpdateSocialLinksDto extends (0, mapped_types_1.PartialType)(create_social_links_dto_1.CreateSocialLinksDto) {
}
exports.UpdateSocialLinksDto = UpdateSocialLinksDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Facebook profile URL',
        example: 'https://facebook.com/username',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "facebookUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Instagram profile URL',
        example: 'https://instagram.com/username',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "instagramUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'TikTok profile URL',
        example: 'https://tiktok.com/@username',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "tiktokUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'YouTube channel URL',
        example: 'https://youtube.com/channel/UC...',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "youtubeUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'LinkedIn profile URL',
        example: 'https://linkedin.com/in/username',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Twitter/X profile URL',
        example: 'https://twitter.com/username',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "twitterUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Telegram profile URL',
        example: 'https://t.me/username',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "telegramUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'WhatsApp phone number for click-to-chat',
        example: '+1234567890',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Personal or business website URL',
        example: 'https://example.com',
        type: String
    }),
    __metadata("design:type", String)
], UpdateSocialLinksDto.prototype, "websiteUrl", void 0);
//# sourceMappingURL=update-social-links.dto.js.map