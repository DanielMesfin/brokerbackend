import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { CampaignAsset } from './entities/campaign-asset.entity';
import { CampaignChannel } from './entities/campaign-channel.entity';
import { CampaignMetric } from './entities/campaign-metric.entity';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      CampaignAsset,
      CampaignChannel,
      CampaignMetric,
    ]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
