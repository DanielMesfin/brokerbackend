import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Campaign, CampaignStatus, CampaignGoal } from './entities/campaign.entity';
import { CampaignAsset } from './entities/campaign-asset.entity';
import { CampaignChannel, ChannelType } from './entities/campaign-channel.entity';
import { CampaignMetric } from './entities/campaign-metric.entity';

export interface CreateCampaignDto {
  name: string;
  description?: string;
  productId: string;
  targetAudience: any;
  budget: number;
  startDate: Date;
  endDate?: Date;
  goal: CampaignGoal;
  status?: CampaignStatus;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {}

export interface CampaignMetricsSummary {
  totalImpressions: number;
  totalClicks: number;
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  averageCtr: number;
  averageCpc: number;
  averageRoi: number;
  channelPerformance: Array<{
    channelId: string;
    channelName: string;
    channelType: ChannelType;
    impressions: number;
    clicks: number;
    spend: number;
    revenue: number;
    roas: number;
  }>;
  timeline: Array<{
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
    revenue: number;
  }>;
}

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(CampaignAsset)
    private readonly assetRepository: Repository<CampaignAsset>,
    @InjectRepository(CampaignChannel)
    private readonly channelRepository: Repository<CampaignChannel>,
    @InjectRepository(CampaignMetric)
    private readonly metricRepository: Repository<CampaignMetric>,
  ) {}

  // Campaign CRUD
  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepository.create({
      ...createCampaignDto,
      status: createCampaignDto.status || CampaignStatus.DRAFT,
    });
    return this.campaignRepository.save(campaign);
  }

  async findAll(
    status?: CampaignStatus,
    goal?: CampaignGoal,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Campaign[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (goal) where.goal = goal;
    if (startDate || endDate) {
      where.startDate = Between(
        startDate || new Date(0),
        endDate || new Date(),
      );
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

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['channels', 'assets', 'metrics'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);
    Object.assign(campaign, updateCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  async remove(id: string): Promise<void> {
    const result = await this.campaignRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
  }

  // Campaign Assets
  async addAsset(campaignId: string, assetData: Partial<CampaignAsset>): Promise<CampaignAsset> {
    const campaign = await this.findOne(campaignId);
    const asset = this.assetRepository.create({
      ...assetData,
      campaign,
    });
    return this.assetRepository.save(asset);
  }

  async removeAsset(assetId: string): Promise<void> {
    await this.assetRepository.delete(assetId);
  }

  // Campaign Channels
  async addChannel(campaignId: string, channelData: Partial<CampaignChannel>): Promise<CampaignChannel> {
    const campaign = await this.findOne(campaignId);
    const channel = this.channelRepository.create({
      ...channelData,
      campaign,
    });
    return this.channelRepository.save(channel);
  }

  async updateChannel(channelId: string, channelData: Partial<CampaignChannel>): Promise<CampaignChannel> {
    const channel = await this.channelRepository.findOne({ where: { id: channelId } });
    if (!channel) {
      throw new NotFoundException(`Channel with ID ${channelId} not found`);
    }
    Object.assign(channel, channelData);
    return this.channelRepository.save(channel);
  }

  async removeChannel(channelId: string): Promise<void> {
    await this.channelRepository.delete(channelId);
  }

  // Campaign Metrics
  async addMetrics(campaignId: string, metricsData: Partial<CampaignMetric>): Promise<CampaignMetric> {
    const campaign = await this.findOne(campaignId);
    const metric = this.metricRepository.create({
      ...metricsData,
      campaign,
    });
    return this.metricRepository.save(metric);
  }

  async getCampaignMetrics(campaignId: string): Promise<CampaignMetricsSummary> {
    const campaign = await this.findOne(campaignId);
    
    // Get all metrics for this campaign
    const metrics = await this.metricRepository.find({
      where: { campaign: { id: campaignId } },
      order: { date: 'ASC' },
    });

    // Get all channels for this campaign
    const channels = await this.channelRepository.find({
      where: { campaign: { id: campaignId } },
    });

    // Calculate summary metrics
    const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
    const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
    const totalSpend = metrics.reduce((sum, m) => sum + (m.spend || 0), 0);
    const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
    const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0);
    
    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const averageRoi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    // Calculate channel performance
    const channelPerformance = await Promise.all(channels.map(async (channel) => {
      const channelMetrics = await this.metricRepository.find({
        where: { campaign: { id: campaignId } },
        // Add channel filtering if you have channel-specific metrics
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

    // Prepare timeline data (group by date)
    const timelineMap = new Map<string, any>();
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

  // Campaign status management
  async startCampaign(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    if (campaign.status !== CampaignStatus.DRAFT) {
      throw new Error('Only draft campaigns can be started');
    }
    campaign.status = CampaignStatus.ACTIVE;
    campaign.startDate = new Date();
    return this.campaignRepository.save(campaign);
  }

  async pauseCampaign(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new Error('Only active campaigns can be paused');
    }
    campaign.status = CampaignStatus.PAUSED;
    return this.campaignRepository.save(campaign);
  }

  async resumeCampaign(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    if (campaign.status !== CampaignStatus.PAUSED) {
      throw new Error('Only paused campaigns can be resumed');
    }
    campaign.status = CampaignStatus.ACTIVE;
    return this.campaignRepository.save(campaign);
  }

  async completeCampaign(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    campaign.status = CampaignStatus.COMPLETED;
    campaign.endDate = new Date();
    return this.campaignRepository.save(campaign);
  }

  // Helper methods
  async getActiveCampaigns(): Promise<Campaign[]> {
    return this.campaignRepository.find({
      where: { status: CampaignStatus.ACTIVE },
      relations: ['channels', 'assets'],
    });
  }

  async getUpcomingCampaigns(): Promise<Campaign[]> {
    const now = new Date();
    return this.campaignRepository.find({
      where: {
        status: CampaignStatus.DRAFT,
        startDate: MoreThanOrEqual(now),
      },
      order: { startDate: 'ASC' },
      take: 5,
    });
  }

  async getCampaignPerformance(campaignId: string): Promise<{
    campaign: Campaign;
    metrics: CampaignMetricsSummary;
    topPerformingChannels: Array<{ id: string; name: string; type: ChannelType; roas: number }>;
  }> {
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
}
