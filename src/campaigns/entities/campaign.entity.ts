import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CampaignAsset } from './campaign-asset.entity.js';
import { CampaignChannel } from './campaign-channel.entity.js';
import { CampaignMetric } from './campaign-metric.entity.js';

export enum CampaignGoal {
  AWARENESS = 'awareness',
  SALES = 'sales',
  LEADS = 'leads',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('uuid')
  productId: string;

  @Column('simple-json', { nullable: true })
  targetAudience: {
    ageRange?: [number, number];
    locations?: string[];
    interests?: string[];
    behaviors?: string[];
  };

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  spent: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: CampaignGoal,
    default: CampaignGoal.AWARENESS,
  })
  goal: CampaignGoal;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @OneToMany(() => CampaignAsset, (asset) => asset.campaign, { cascade: true })
  assets: CampaignAsset[];

  @OneToMany(() => CampaignChannel, (channel) => channel.campaign, { cascade: true })
  channels: CampaignChannel[];

  @OneToMany(() => CampaignMetric, (metric) => metric.campaign, { cascade: true })
  metrics: CampaignMetric[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
