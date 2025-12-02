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
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const campaign_entity_1 = require("./entities/campaign.entity");
const campaign_asset_entity_1 = require("./entities/campaign-asset.entity");
const campaign_channel_entity_1 = require("./entities/campaign-channel.entity");
const campaign_metric_entity_1 = require("./entities/campaign-metric.entity");
let CampaignsService = class CampaignsService {
    constructor(campaignRepository, assetRepository, channelRepository, metricRepository) {
        this.campaignRepository = campaignRepository;
        this.assetRepository = assetRepository;
        this.channelRepository = channelRepository;
        this.metricRepository = metricRepository;
    }
    async create(createCampaignDto) {
        const campaign = this.campaignRepository.create({
            ...createCampaignDto,
            status: createCampaignDto.status || campaign_entity_1.CampaignStatus.DRAFT,
        });
        return this.campaignRepository.save(campaign);
    }
    async findAll(status, goal, startDate, endDate, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (goal)
            where.goal = goal;
        if (startDate || endDate) {
            where.startDate = (0, typeorm_2.Between)(startDate || new Date(0), endDate || new Date());
        }
        const [data, total] = await this.campaignRepository.findAndCount({
            where,
            relations: ['channels', 'assets'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return { data, total };
    }
    async findOne(id) {
        const campaign = await this.campaignRepository.findOne({
            where: { id },
            relations: ['channels', 'assets', 'metrics'],
        });
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        return campaign;
    }
    async update(id, updateCampaignDto) {
        const campaign = await this.findOne(id);
        Object.assign(campaign, updateCampaignDto);
        return this.campaignRepository.save(campaign);
    }
    async remove(id) {
        const result = await this.campaignRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
    }
    async addAsset(campaignId, assetData) {
        const campaign = await this.findOne(campaignId);
        const asset = this.assetRepository.create({
            ...assetData,
            campaign,
        });
        return this.assetRepository.save(asset);
    }
    async removeAsset(assetId) {
        await this.assetRepository.delete(assetId);
    }
    async addChannel(campaignId, channelData) {
        const campaign = await this.findOne(campaignId);
        const channel = this.channelRepository.create({
            ...channelData,
            campaign,
        });
        return this.channelRepository.save(channel);
    }
    async updateChannel(channelId, channelData) {
        const channel = await this.channelRepository.findOne({ where: { id: channelId } });
        if (!channel) {
            throw new common_1.NotFoundException(`Channel with ID ${channelId} not found`);
        }
        Object.assign(channel, channelData);
        return this.channelRepository.save(channel);
    }
    async removeChannel(channelId) {
        await this.channelRepository.delete(channelId);
    }
    async addMetrics(campaignId, metricsData) {
        const campaign = await this.findOne(campaignId);
        const metric = this.metricRepository.create({
            ...metricsData,
            campaign,
        });
        return this.metricRepository.save(metric);
    }
    async getCampaignMetrics(campaignId) {
        const campaign = await this.findOne(campaignId);
        const metrics = await this.metricRepository.find({
            where: { campaign: { id: campaignId } },
            order: { date: 'ASC' },
        });
        const channels = await this.channelRepository.find({
            where: { campaign: { id: campaignId } },
        });
        const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
        const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
        const totalSpend = metrics.reduce((sum, m) => sum + (m.spend || 0), 0);
        const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
        const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0);
        const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const averageCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
        const averageRoi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
        const channelPerformance = await Promise.all(channels.map(async (channel) => {
            const channelMetrics = await this.metricRepository.find({
                where: { campaign: { id: campaignId } },
            });
            const channelImpressions = channelMetrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
            const channelClicks = channelMetrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
            const channelSpend = channelMetrics.reduce((sum, m) => sum + (m.spend || 0), 0);
            const channelRevenue = channelMetrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
            const channelRoas = channelSpend > 0 ? (channelRevenue / channelSpend) : 0;
            return {
                channelId: channel.id,
                channelName: channel.name,
                channelType: channel.type,
                impressions: channelImpressions,
                clicks: channelClicks,
                spend: channelSpend,
                revenue: channelRevenue,
                roas: channelRoas,
            };
        }));
        const timelineMap = new Map();
        metrics.forEach((metric) => {
            const dateStr = metric.date.toISOString().split('T')[0];
            if (!timelineMap.has(dateStr)) {
                timelineMap.set(dateStr, {
                    date: dateStr,
                    impressions: 0,
                    clicks: 0,
                    spend: 0,
                    revenue: 0,
                });
            }
            const dayData = timelineMap.get(dateStr);
            dayData.impressions += metric.impressions || 0;
            dayData.clicks += metric.clicks || 0;
            dayData.spend += metric.spend || 0;
            dayData.revenue += metric.revenue || 0;
        });
        const timeline = Array.from(timelineMap.values());
        return {
            totalImpressions,
            totalClicks,
            totalSpend,
            totalRevenue,
            totalConversions,
            averageCtr,
            averageCpc,
            averageRoi,
            channelPerformance,
            timeline,
        };
    }
    async startCampaign(id) {
        const campaign = await this.findOne(id);
        if (campaign.status !== campaign_entity_1.CampaignStatus.DRAFT) {
            throw new Error('Only draft campaigns can be started');
        }
        campaign.status = campaign_entity_1.CampaignStatus.ACTIVE;
        campaign.startDate = new Date();
        return this.campaignRepository.save(campaign);
    }
    async pauseCampaign(id) {
        const campaign = await this.findOne(id);
        if (campaign.status !== campaign_entity_1.CampaignStatus.ACTIVE) {
            throw new Error('Only active campaigns can be paused');
        }
        campaign.status = campaign_entity_1.CampaignStatus.PAUSED;
        return this.campaignRepository.save(campaign);
    }
    async resumeCampaign(id) {
        const campaign = await this.findOne(id);
        if (campaign.status !== campaign_entity_1.CampaignStatus.PAUSED) {
            throw new Error('Only paused campaigns can be resumed');
        }
        campaign.status = campaign_entity_1.CampaignStatus.ACTIVE;
        return this.campaignRepository.save(campaign);
    }
    async completeCampaign(id) {
        const campaign = await this.findOne(id);
        campaign.status = campaign_entity_1.CampaignStatus.COMPLETED;
        campaign.endDate = new Date();
        return this.campaignRepository.save(campaign);
    }
    async getActiveCampaigns() {
        return this.campaignRepository.find({
            where: { status: campaign_entity_1.CampaignStatus.ACTIVE },
            relations: ['channels', 'assets'],
        });
    }
    async getUpcomingCampaigns() {
        const now = new Date();
        return this.campaignRepository.find({
            where: {
                status: campaign_entity_1.CampaignStatus.DRAFT,
                startDate: (0, typeorm_2.MoreThanOrEqual)(now),
            },
            order: { startDate: 'ASC' },
            take: 5,
        });
    }
    async getCampaignPerformance(campaignId) {
        const campaign = await this.findOne(campaignId);
        const metrics = await this.getCampaignMetrics(campaignId);
        const topPerformingChannels = metrics.channelPerformance
            .sort((a, b) => b.roas - a.roas)
            .slice(0, 3)
            .map(({ channelId, channelName, channelType, roas }) => ({
            id: channelId,
            name: channelName,
            type: channelType,
            roas,
        }));
        return {
            campaign,
            metrics,
            topPerformingChannels,
        };
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(campaign_entity_1.Campaign)),
    __param(1, (0, typeorm_1.InjectRepository)(campaign_asset_entity_1.CampaignAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(campaign_channel_entity_1.CampaignChannel)),
    __param(3, (0, typeorm_1.InjectRepository)(campaign_metric_entity_1.CampaignMetric)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map