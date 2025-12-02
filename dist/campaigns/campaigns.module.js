"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const campaign_entity_1 = require("./entities/campaign.entity");
const campaign_asset_entity_1 = require("./entities/campaign-asset.entity");
const campaign_channel_entity_1 = require("./entities/campaign-channel.entity");
const campaign_metric_entity_1 = require("./entities/campaign-metric.entity");
const campaigns_controller_1 = require("./campaigns.controller");
const campaigns_service_1 = require("./campaigns.service");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../auth/auth.module");
let CampaignsModule = class CampaignsModule {
};
exports.CampaignsModule = CampaignsModule;
exports.CampaignsModule = CampaignsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                campaign_entity_1.Campaign,
                campaign_asset_entity_1.CampaignAsset,
                campaign_channel_entity_1.CampaignChannel,
                campaign_metric_entity_1.CampaignMetric,
            ]),
            config_1.ConfigModule,
            auth_module_1.AuthModule,
        ],
        controllers: [campaigns_controller_1.CampaignsController],
        providers: [campaigns_service_1.CampaignsService],
        exports: [campaigns_service_1.CampaignsService],
    })
], CampaignsModule);
//# sourceMappingURL=campaigns.module.js.map