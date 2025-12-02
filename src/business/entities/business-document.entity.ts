import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Business } from './business.entity';

export enum DocumentType {
  BUSINESS_LICENSE = 'business_license',
  TAX_CERTIFICATE = 'tax_certificate',
  OWNER_ID = 'owner_id',
  BANK_ACCOUNT = 'bank_account',
  INDUSTRY_SPECIFIC = 'industry_specific',
  OTHER = 'other',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('business_documents')
export class BusinessDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.OTHER,
  })
  type: DocumentType;

  @Column()
  name: string;

  @Column()
  fileUrl: string;

  @Column({ type: 'varchar', length: 50 })
  fileType: string;

  @Column({ type: 'int', nullable: true })
  fileSize: number;

  @Column({ type: 'date', nullable: true })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'uuid' })
  uploadedBy: string;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'timestamp' })
  uploadedAt: Date;

  @ManyToOne(() => Business, (business) => business.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
