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
exports.CampaignsController = exports.SortOrder = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const campaigns_service_1 = require("./campaigns.service");
const campaign_entity_1 = require("./entities/campaign.entity");
const campaign_channel_entity_1 = require("./entities/campaign-channel.entity");
const campaign_asset_entity_1 = require("./entities/campaign-asset.entity");
const campaign_metric_entity_1 = require("./entities/campaign-metric.entity");
const campaign_channel_entity_2 = require("./entities/campaign-channel.entity");
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
let CampaignsController = class CampaignsController {
    constructor(campaignsService) {
        this.campaignsService = campaignsService;
    }
    async create(createCampaignDto) {
        return this.campaignsService.create(createCampaignDto);
    }
    async findAll(status, goal, startDate, endDate, page = '1', limit = '10', sortBy = 'createdAt', sortOrder = SortOrder.DESC) {
        return this.campaignsService.findAll(status, goal, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined, parseInt(page, 10), parseInt(limit, 10));
    }
    async findOne(id) {
        return this.campaignsService.findOne(id);
    }
    async update(id, updateCampaignDto) {
        return this.campaignsService.update(id, updateCampaignDto);
    }
    async remove(id) {
        return this.campaignsService.remove(id);
    }
    async startCampaign(id) {
        return this.campaignsService.startCampaign(id);
    }
    async pauseCampaign(id) {
        return this.campaignsService.pauseCampaign(id);
    }
    async resumeCampaign(id) {
        return this.campaignsService.resumeCampaign(id);
    }
    async completeCampaign(id) {
        return this.campaignsService.completeCampaign(id);
    }
    async addAsset(campaignId, assetData) {
        return this.campaignsService.addAsset(campaignId, assetData);
    }
    async removeAsset(assetId) {
        return this.campaignsService.removeAsset(assetId);
    }
    async addChannel(campaignId, channelData) {
        if (!channelData.type || !Object.values(campaign_channel_entity_2.ChannelType).includes(channelData.type)) {
            throw new common_1.BadRequestException('Invalid channel type');
        }
        return this.campaignsService.addChannel(campaignId, channelData);
    }
    async updateChannel(channelId, channelData) {
        if (channelData.type && !Object.values(campaign_channel_entity_2.ChannelType).includes(channelData.type)) {
            throw new common_1.BadRequestException('Invalid channel type');
        }
        return this.campaignsService.updateChannel(channelId, channelData);
    }
    async removeChannel(channelId) {
        return this.campaignsService.removeChannel(channelId);
    }
    async addMetrics(campaignId, metricsData) {
        return this.campaignsService.addMetrics(campaignId, metricsData);
    }
    async getCampaignMetrics(campaignId) {
        return this.campaignsService.getCampaignMetrics(campaignId);
    }
    async getCampaignPerformance(campaignId) {
        return this.campaignsService.getCampaignPerformance(campaignId);
    }
    async getActiveAndUpcomingCampaigns() {
        const [active, upcoming] = await Promise.all([
            this.campaignsService.getActiveCampaigns(),
            this.campaignsService.getUpcomingCampaigns(),
        ]);
        return { active, upcoming };
    }
    getChannelTypes() {
        return Object.values(campaign_channel_entity_2.ChannelType);
    }
    getCampaignGoals() {
        return Object.values({
            AWARENESS: 'awareness',
            SALES: 'sales',
            LEADS: 'leads',
            ENGAGEMENT: 'engagement',
            CONVERSION: 'conversion',
        });
    }
};
exports.CampaignsController = CampaignsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new campaign' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The campaign has been successfully created.', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all campaigns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all campaigns.', type: [campaign_entity_1.Campaign] }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('goal')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a campaign by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the campaign with the specified ID.', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The campaign has been successfully updated.', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The campaign has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The campaign has been started.', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot start the campaign.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "startCampaign", null);
__decorate([
    (0, common_1.Post)(':id/pause'),
    (0, swagger_1.ApiOperation)({ summary: 'Pause a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The campaign has been paused.', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot pause the campaign.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "pauseCampaign", null);
__decorate([
    (0, common_1.Post)(':id/resume'),
    (0, swagger_1.ApiOperation)({ summary: 'Resume a paused campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The campaign has been resumed.', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot resume the campaign.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "resumeCampaign", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a campaign as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The campaign has been marked as completed.', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "completeCampaign", null);
__decorate([
    (0, common_1.Post)(':id/assets'),
    (0, swagger_1.ApiOperation)({ summary: 'Add an asset to a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The asset has been added to the campaign.', type: campaign_asset_entity_1.CampaignAsset }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "addAsset", null);
__decorate([
    (0, common_1.Delete)('assets/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an asset from a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The asset has been removed from the campaign.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found.' }),
    __param(0, (0, common_1.Param)('assetId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "removeAsset", null);
__decorate([
    (0, common_1.Post)(':id/channels'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a channel to a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The channel has been added to the campaign.', type: campaign_channel_entity_1.CampaignChannel }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid channel data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "addChannel", null);
__decorate([
    (0, common_1.Put)('channels/:channelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a campaign channel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The channel has been updated.', type: campaign_channel_entity_1.CampaignChannel }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid channel data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Channel not found.' }),
    __param(0, (0, common_1.Param)('channelId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "updateChannel", null);
__decorate([
    (0, common_1.Delete)('channels/:channelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a channel from a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The channel has been removed from the campaign.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Channel not found.' }),
    __param(0, (0, common_1.Param)('channelId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "removeChannel", null);
__decorate([
    (0, common_1.Post)(':id/metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Add metrics for a campaign' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The metrics have been added to the campaign.', type: campaign_metric_entity_1.CampaignMetric }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "addMetrics", null);
__decorate([
    (0, common_1.Get)(':id/metrics/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign metrics summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the campaign metrics summary.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getCampaignMetrics", null);
__decorate([
    (0, common_1.Get)(':id/performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign performance data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the campaign performance data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getCampaignPerformance", null);
__decorate([
    (0, common_1.Get)('active/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active and upcoming campaigns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return active and upcoming campaigns.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getActiveAndUpcomingCampaigns", null);
__decorate([
    (0, common_1.Get)('channel-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available channel types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all available channel types.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "getChannelTypes", null);
__decorate([
    (0, common_1.Get)('campaign-goals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available campaign goals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all available campaign goals.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "getCampaignGoals", null);
exports.CampaignsController = CampaignsController = __decorate([
    (0, swagger_1.ApiTags)('campaigns'),
    (0, common_1.Controller)('campaigns'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [campaigns_service_1.CampaignsService])
], CampaignsController);
//# sourceMappingURL=campaigns.controller.js.map