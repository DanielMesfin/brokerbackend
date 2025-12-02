import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

export enum ChannelType {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  EMAIL = 'email',
  GOOGLE_ADS = 'google_ads',
  SMS = 'sms',
  WEBSITE_BANNER = 'website_banner',
  INFLUENCER = 'influencer',
  OTHER = 'other',
}

@Entity('campaign_channels')
export class CampaignChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaignId: string;

  @Column({
    type: 'enum',
    enum: ChannelType,
    nullable: false
  })
  type: ChannelType;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  budget: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  spent: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column('simple-json', { nullable: true })
  settings: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Campaign, (campaign) => campaign.channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
