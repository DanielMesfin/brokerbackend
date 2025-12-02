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
exports.CampaignAsset = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const campaign_entity_1 = require("./campaign.entity");
var AssetType;
(function (AssetType) {
    AssetType["IMAGE"] = "image";
    AssetType["VIDEO"] = "video";
    AssetType["SCRIPT"] = "script";
    AssetType["LANDING_PAGE"] = "landing_page";
    AssetType["TRACKING_LINK"] = "tracking_link";
    AssetType["BANNER"] = "banner";
    AssetType["OTHER"] = "other";
})(AssetType || (exports.AssetType = AssetType = {}));
let CampaignAsset = class CampaignAsset {
};
exports.CampaignAsset = CampaignAsset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CampaignAsset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignAsset.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetType,
        default: AssetType.OTHER,
    }),
    __metadata("design:type", String)
], CampaignAsset.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignAsset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CampaignAsset.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], CampaignAsset.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], CampaignAsset.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campaign_entity_1.Campaign, (campaign) => campaign.assets, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campaignId' }),
    __metadata("design:type", campaign_entity_1.Campaign)
], CampaignAsset.prototype, "campaign", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CampaignAsset.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CampaignAsset.prototype, "updatedAt", void 0);
exports.CampaignAsset = CampaignAsset = __decorate([
    (0, typeorm_1.Entity)('campaign_assets')
], CampaignAsset);
//# sourceMappingURL=campaign-asset.entity.js.map