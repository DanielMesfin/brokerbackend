import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CampaignsService, CreateCampaignDto, UpdateCampaignDto } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { CampaignChannel } from './entities/campaign-channel.entity';
import { CampaignAsset } from './entities/campaign-asset.entity';
import { CampaignMetric } from './entities/campaign-metric.entity';
import { ChannelType } from './entities/campaign-channel.entity';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@ApiTags('campaigns')
@Controller('campaigns')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'The campaign has been successfully created.', type: Campaign })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Return all campaigns.', type: [Campaign] })
  async findAll(
    @Query('status') status?: string,
    @Query('goal') goal?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: SortOrder = SortOrder.DESC,
  ) {
    return this.campaignsService.findAll(
      status as any,
      goal as any,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by ID' })
  @ApiResponse({ status: 200, description: 'Return the campaign with the specified ID.', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Campaign> {
    return this.campaignsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiResponse({ status: 200, description: 'The campaign has been successfully updated.', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign' })
  @ApiResponse({ status: 200, description: 'The campaign has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.campaignsService.remove(id);
  }

  // Campaign Status Management
  @Post(':id/start')
  @ApiOperation({ summary: 'Start a campaign' })
  @ApiResponse({ status: 200, description: 'The campaign has been started.', type: Campaign })
  @ApiResponse({ status: 400, description: 'Cannot start the campaign.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async startCampaign(@Param('id', ParseUUIDPipe) id: string): Promise<Campaign> {
    return this.campaignsService.startCampaign(id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause a campaign' })
  @ApiResponse({ status: 200, description: 'The campaign has been paused.', type: Campaign })
  @ApiResponse({ status: 400, description: 'Cannot pause the campaign.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async pauseCampaign(@Param('id', ParseUUIDPipe) id: string): Promise<Campaign> {
    return this.campaignsService.pauseCampaign(id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused campaign' })
  @ApiResponse({ status: 200, description: 'The campaign has been resumed.', type: Campaign })
  @ApiResponse({ status: 400, description: 'Cannot resume the campaign.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async resumeCampaign(@Param('id', ParseUUIDPipe) id: string): Promise<Campaign> {
    return this.campaignsService.resumeCampaign(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark a campaign as completed' })
  @ApiResponse({ status: 200, description: 'The campaign has been marked as completed.', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async completeCampaign(@Param('id', ParseUUIDPipe) id: string): Promise<Campaign> {
    return this.campaignsService.completeCampaign(id);
  }

  // Campaign Assets
  @Post(':id/assets')
  @ApiOperation({ summary: 'Add an asset to a campaign' })
  @ApiResponse({ status: 201, description: 'The asset has been added to the campaign.', type: CampaignAsset })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async addAsset(
    @Param('id', ParseUUIDPipe) campaignId: string,
    @Body() assetData: Partial<CampaignAsset>,
  ): Promise<CampaignAsset> {
    return this.campaignsService.addAsset(campaignId, assetData);
  }

  @Delete('assets/:assetId')
  @ApiOperation({ summary: 'Remove an asset from a campaign' })
  @ApiResponse({ status: 200, description: 'The asset has been removed from the campaign.' })
  @ApiResponse({ status: 404, description: 'Asset not found.' })
  async removeAsset(@Param('assetId', ParseUUIDPipe) assetId: string): Promise<void> {
    return this.campaignsService.removeAsset(assetId);
  }

  // Campaign Channels
  @Post(':id/channels')
  @ApiOperation({ summary: 'Add a channel to a campaign' })
  @ApiResponse({ status: 201, description: 'The channel has been added to the campaign.', type: CampaignChannel })
  @ApiResponse({ status: 400, description: 'Invalid channel data.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async addChannel(
    @Param('id', ParseUUIDPipe) campaignId: string,
    @Body() channelData: Partial<CampaignChannel>,
  ): Promise<CampaignChannel> {
    if (!channelData.type || !Object.values(ChannelType).includes(channelData.type as ChannelType)) {
      throw new BadRequestException('Invalid channel type');
    }
    return this.campaignsService.addChannel(campaignId, channelData);
  }

  @Put('channels/:channelId')
  @ApiOperation({ summary: 'Update a campaign channel' })
  @ApiResponse({ status: 200, description: 'The channel has been updated.', type: CampaignChannel })
  @ApiResponse({ status: 400, description: 'Invalid channel data.' })
  @ApiResponse({ status: 404, description: 'Channel not found.' })
  async updateChannel(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Body() channelData: Partial<CampaignChannel>,
  ): Promise<CampaignChannel> {
    if (channelData.type && !Object.values(ChannelType).includes(channelData.type as ChannelType)) {
      throw new BadRequestException('Invalid channel type');
    }
    return this.campaignsService.updateChannel(channelId, channelData);
  }

  @Delete('channels/:channelId')
  @ApiOperation({ summary: 'Remove a channel from a campaign' })
  @ApiResponse({ status: 200, description: 'The channel has been removed from the campaign.' })
  @ApiResponse({ status: 404, description: 'Channel not found.' })
  async removeChannel(@Param('channelId', ParseUUIDPipe) channelId: string): Promise<void> {
    return this.campaignsService.removeChannel(channelId);
  }

  // Campaign Metrics
  @Post(':id/metrics')
  @ApiOperation({ summary: 'Add metrics for a campaign' })
  @ApiResponse({ status: 201, description: 'The metrics have been added to the campaign.', type: CampaignMetric })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async addMetrics(
    @Param('id', ParseUUIDPipe) campaignId: string,
    @Body() metricsData: Partial<CampaignMetric>,
  ): Promise<CampaignMetric> {
    return this.campaignsService.addMetrics(campaignId, metricsData);
  }

  @Get(':id/metrics/summary')
  @ApiOperation({ summary: 'Get campaign metrics summary' })
  @ApiResponse({ status: 200, description: 'Return the campaign metrics summary.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async getCampaignMetrics(@Param('id', ParseUUIDPipe) campaignId: string) {
    return this.campaignsService.getCampaignMetrics(campaignId);
  }

  @Get(':id/performance')
  @ApiOperation({ summary: 'Get campaign performance data' })
  @ApiResponse({ status: 200, description: 'Return the campaign performance data.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  async getCampaignPerformance(@Param('id', ParseUUIDPipe) campaignId: string) {
    return this.campaignsService.getCampaignPerformance(campaignId);
  }

  // Additional endpoints
  @Get('active/upcoming')
  @ApiOperation({ summary: 'Get active and upcoming campaigns' })
  @ApiResponse({ status: 200, description: 'Return active and upcoming campaigns.' })
  async getActiveAndUpcomingCampaigns() {
    const [active, upcoming] = await Promise.all([
      this.campaignsService.getActiveCampaigns(),
      this.campaignsService.getUpcomingCampaigns(),
    ]);
    return { active, upcoming };
  }

  @Get('channel-types')
  @ApiOperation({ summary: 'Get all available channel types' })
  @ApiResponse({ status: 200, description: 'Return all available channel types.' })
  getChannelTypes() {
    return Object.values(ChannelType);
  }

  @Get('campaign-goals')
  @ApiOperation({ summary: 'Get all available campaign goals' })
  @ApiResponse({ status: 200, description: 'Return all available campaign goals.' })
  getCampaignGoals() {
    // This would be imported from the Campaign entity
    return Object.values({
      AWARENESS: 'awareness',
      SALES: 'sales',
      LEADS: 'leads',
      ENGAGEMENT: 'engagement',
      CONVERSION: 'conversion',
    });
  }
}
