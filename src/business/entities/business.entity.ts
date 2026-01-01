import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Promotion } from './promotion.entity';
import { BusinessDocument } from './business-document.entity';
import { BusinessVerification } from './business-verification.entity';
import { BusinessCompliance } from './business-compliance.entity';

export enum BusinessType {
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  PARTNERSHIP = 'partnership',
  LLC = 'llc',
  CORPORATION = 'corporation',
  NON_PROFIT = 'non_profit',
  OTHER = 'other',
}

export enum BusinessStatus {
  DRAFT = 'draft',
  PENDING_VERIFICATION = 'pending_verification',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Business Information
  @Column()
  legalName: string;

  @Column({ nullable: true })
  tradeName: string;

  @Column({
    type: 'enum',
    enum: BusinessType,
    default: BusinessType.OTHER,
  })
  businessType: BusinessType;

  @Column()
  industry: string;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  taxIdentificationNumber: string;

  @Column('text')
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'date', nullable: true })
  establishmentDate: Date;

  // Contact Information
  @Column()
  ownerName: string;

  @Column()
  ownerEmail: string;

  @Column()
  ownerPhone: string;

  @Column({ nullable: true })
  website: string;

  // Status
  @Column({
    type: 'enum',
    enum: BusinessStatus,
    default: BusinessStatus.DRAFT,
  })
  status: BusinessStatus;

  @Column({ nullable: true })
  rejectionReason: string;

  // Relations
  @OneToMany(() => BusinessDocument, (document) => document.business, { cascade: true })
  documents: BusinessDocument[];

  @OneToMany(() => Promotion, (promotion) => promotion.business, { cascade: true })
  promotions: Promotion[];

  @OneToOne(() => BusinessVerification, { cascade: true })
  @JoinColumn()
  verification: BusinessVerification;

  @OneToOne(() => BusinessCompliance, { cascade: true })
  @JoinColumn()
  compliance: BusinessCompliance;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string | null;

  @Column({ type: 'varchar', nullable: true })
  suspensionReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Soft delete
  @Column({ default: false })
  isDeleted: boolean;
}
