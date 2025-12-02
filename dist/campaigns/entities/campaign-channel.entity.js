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
exports.CampaignChannel = exports.ChannelType = void 0;
const typeorm_1 = require("typeorm");
const campaign_entity_1 = require("./campaign.entity");
var ChannelType;
(function (ChannelType) {
    ChannelType["FACEBOOK"] = "facebook";
    ChannelType["INSTAGRAM"] = "instagram";
    ChannelType["TIKTOK"] = "tiktok";
    ChannelType["EMAIL"] = "email";
    ChannelType["GOOGLE_ADS"] = "google_ads";
    ChannelType["SMS"] = "sms";
    ChannelType["WEBSITE_BANNER"] = "website_banner";
    ChannelType["INFLUENCER"] = "influencer";
    ChannelType["OTHER"] = "other";
})(ChannelType || (exports.ChannelType = ChannelType = {}));
let CampaignChannel = class CampaignChannel {
};
exports.CampaignChannel = CampaignChannel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CampaignChannel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignChannel.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChannelType,
        nullable: false
    }),
    __metadata("design:type", String)
], CampaignChannel.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignChannel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], CampaignChannel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CampaignChannel.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CampaignChannel.prototype, "spent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CampaignChannel.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CampaignChannel.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], CampaignChannel.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CampaignChannel.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campaign_entity_1.Campaign, (campaign) => campaign.channels, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campaignId' }),
    __metadata("design:type", campaign_entity_1.Campaign)
], CampaignChannel.prototype, "campaign", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CampaignChannel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CampaignChannel.prototype, "updatedAt", void 0);
exports.CampaignChannel = CampaignChannel = __decorate([
    (0, typeorm_1.Entity)('campaign_channels')
], CampaignChannel);
//# sourceMappingURL=campaign-channel.entity.js.map