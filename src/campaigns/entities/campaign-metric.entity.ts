import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity('campaign_metrics')
export class CampaignMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaignId: string;

  @Column({ type: 'date' })
  date: Date;

  // Basic Metrics
  @Column('int', { default: 0 })
  impressions: number;

  @Column('int', { default: 0 })
  clicks: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  ctr: number; // Click-Through Rate

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cpc: number; // Cost Per Click

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cpm: number; // Cost Per 1000 Impressions

  @Column('int', { default: 0 })
  conversions: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  conversionRate: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  spend: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  roas: number; // Return on Ad Spend

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  roi: number; // Return on Investment

  // Engagement Metrics
  @Column('int', { default: 0 })
  likes: number;

  @Column('int', { default: 0 })
  shares: number;

  @Column('int', { default: 0 })
  comments: number;

  @Column('int', { default: 0 })
  saves: number;

  // Email/Specific Metrics
  @Column('int', { default: 0 })
  opens: number;

  @Column('int', { default: 0 })
  unsubscribes: number;

  @Column('int', { default: 0 })
  bounces: number;

  // Custom metrics
  @Column('simple-json', { nullable: true })
  customMetrics: Record<string, any>;

  @ManyToOne(() => Campaign, (campaign) => campaign.metrics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
