import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from './business.entity';

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_ONE_GET_ONE = 'BUY_ONE_GET_ONE',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  SCHEDULED = 'SCHEDULED',
}

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: PromotionType,
  })
  type: PromotionType;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({ unique: true })
  code: string;

  @Column('timestamp with time zone')
  startDate: Date;

  @Column('timestamp with time zone')
  endDate: Date;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: 0 })
  maxUses: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxDiscountAmount: number | null;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  minOrderAmount: number;

  @Column({
    type: 'enum',
    enum: PromotionStatus,
    default: PromotionStatus.DRAFT,
  })
  status: PromotionStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  businessId: string | null;

  @ManyToOne(() => Business, business => business.promotions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to check if promotion is valid
  isValid(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      this.status === PromotionStatus.ACTIVE &&
      this.startDate <= now &&
      this.endDate >= now &&
      (this.maxUses === 0 || this.usageCount < this.maxUses)
    );
  }

  // Apply promotion to an order amount
  applyDiscount(amount: number): number {
    if (!this.isValid() || amount < this.minOrderAmount) {
      return amount;
    }

    let discount = 0;
    switch (this.type) {
      case PromotionType.PERCENTAGE:
        discount = (amount * this.value) / 100;
        if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
          discount = this.maxDiscountAmount;
        }
        break;
      case PromotionType.FIXED_AMOUNT:
        discount = Math.min(this.value, amount);
        break;
      case PromotionType.FREE_SHIPPING:
        // Assuming shipping cost is handled separately
        break;
      case PromotionType.BUY_ONE_GET_ONE:
        // This would be handled at the order item level
        break;
    }

    return Math.max(0, amount - discount);
  }
}
