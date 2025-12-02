import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Business } from './business.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum VerificationMethod {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  THIRD_PARTY = 'third_party',
}

@Entity('business_verifications')
export class BusinessVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  businessId: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({
    type: 'enum',
    enum: VerificationMethod,
    nullable: true,
  })
  verificationMethod: VerificationMethod;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'jsonb', nullable: true })
  verificationData: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  verifiedById: string;

  @Column({ type: 'varchar', nullable: true })
  verifiedByName: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'boolean', default: false })
  isAutoVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  riskAssessment: {
    score: number;
    level: 'low' | 'medium' | 'high';
    reasons: string[];
  };

  @OneToOne(() => Business, (business) => business.verification, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods
  isVerified(): boolean {
    return this.status === VerificationStatus.VERIFIED;
  }

  needsReview(): boolean {
    return [VerificationStatus.PENDING, VerificationStatus.IN_REVIEW].includes(this.status);
  }
}
