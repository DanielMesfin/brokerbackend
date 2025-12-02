import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  SCRIPT = 'script',
  LANDING_PAGE = 'landing_page',
  TRACKING_LINK = 'tracking_link',
  BANNER = 'banner',
  OTHER = 'other',
}

@Entity('campaign_assets')
export class CampaignAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaignId: string;

  @Column({
    type: 'enum',
    enum: AssetType,
    default: AssetType.OTHER,
  })
  type: AssetType;

  @Column()
  name: string;

  @Column('text')
  url: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Campaign, (campaign) => campaign.assets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
