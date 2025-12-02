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
exports.Campaign = exports.CampaignStatus = exports.CampaignGoal = void 0;
const typeorm_1 = require("typeorm");
const campaign_asset_entity_js_1 = require("./campaign-asset.entity.js");
const campaign_channel_entity_js_1 = require("./campaign-channel.entity.js");
const campaign_metric_entity_js_1 = require("./campaign-metric.entity.js");
var CampaignGoal;
(function (CampaignGoal) {
    CampaignGoal["AWARENESS"] = "awareness";
    CampaignGoal["SALES"] = "sales";
    CampaignGoal["LEADS"] = "leads";
    CampaignGoal["ENGAGEMENT"] = "engagement";
    CampaignGoal["CONVERSION"] = "conversion";
})(CampaignGoal || (exports.CampaignGoal = CampaignGoal = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["ACTIVE"] = "active";
    CampaignStatus["PAUSED"] = "paused";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["CANCELLED"] = "cancelled";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
let Campaign = class Campaign {
};
exports.Campaign = Campaign;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Campaign.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Campaign.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Campaign.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Campaign.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], Campaign.prototype, "targetAudience", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Campaign.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "spent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Campaign.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Campaign.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CampaignGoal,
        default: CampaignGoal.AWARENESS,
    }),
    __metadata("design:type", String)
], Campaign.prototype, "goal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Campaign.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_asset_entity_js_1.CampaignAsset, (asset) => asset.campaign, { cascade: true }),
    __metadata("design:type", Array)
], Campaign.prototype, "assets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_channel_entity_js_1.CampaignChannel, (channel) => channel.campaign, { cascade: true }),
    __metadata("design:type", Array)
], Campaign.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_metric_entity_js_1.CampaignMetric, (metric) => metric.campaign, { cascade: true }),
    __metadata("design:type", Array)
], Campaign.prototype, "metrics", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Campaign.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Campaign.prototype, "updatedAt", void 0);
exports.Campaign = Campaign = __decorate([
    (0, typeorm_1.Entity)('campaigns')
], Campaign);
//# sourceMappingURL=campaign.entity.js.map