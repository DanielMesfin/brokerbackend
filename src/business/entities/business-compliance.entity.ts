import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Business } from './business.entity';

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  AT_RISK = 'at_risk',
  SUSPENDED = 'suspended',
}

export enum ComplianceRequirementStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  WAIVED = 'waived',
  NOT_REQUIRED = 'not_required',
}

interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: ComplianceRequirementStatus;
  required: boolean;
  dueDate?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  notes?: string;
}

interface ComplianceSettings {
  autoSuspend: boolean;
  notifyDaysBeforeExpiry: number[];
  notifyOn: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  gracePeriodDays: number;
}

interface ComplianceHistoryItem {
  date: Date;
  action: string;
  performedBy: string;
  details: Record<string, any>;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

@Entity('business_compliances')
export class BusinessCompliance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  businessId: string;

  @Column({
    type: 'enum',
    enum: ComplianceStatus,
    default: ComplianceStatus.NON_COMPLIANT,
  })
  status: ComplianceStatus;

  @Column({ type: 'int', default: 0 })
  complianceScore: number;

  @Column({ type: 'jsonb', default: [] })
  requirements: ComplianceRequirement[];

  @Column({ type: 'jsonb', default: {} })
  settings: ComplianceSettings;

  @Column({ type: 'jsonb', default: [] })
  history: ComplianceHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  lastAudit?: {
    date: Date;
    performedBy: string;
    notes: string;
    findings: string[];
  } | null;

  @Column({ type: 'date', nullable: true })
  nextAuditDate: Date;

  @Column({ type: 'boolean', default: false })
  isSuspended: boolean;

  @Column({ type: 'text', nullable: true })
  suspensionReason: string | null = null;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date | null = null;

  @Column({ type: 'timestamp', nullable: true })
  lastComplianceCheck: Date;

  @Column({ type: 'jsonb', nullable: true })
  riskFactors: {
    highRiskDocuments: string[];
    expiredDocuments: string[];
    missingDocuments: string[];
    pendingVerification: string[];
  };

  @OneToOne(() => Business, (business) => business.compliance, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods
  isCompliant(): boolean {
    return this.status === ComplianceStatus.COMPLIANT;
  }

  getExpiringRequirements(days: number = 30): ComplianceRequirement[] {
    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(now.getDate() + days);

    return this.requirements.filter(req => {
      if (!req.dueDate) return false;
      const dueDate = new Date(req.dueDate);
      return dueDate <= threshold && dueDate >= now;
    });
  }

  getNonCompliantRequirements(): ComplianceRequirement[] {
    return this.requirements.filter(
      req => req.status === ComplianceRequirementStatus.EXPIRED || 
            (req.required && req.status !== ComplianceRequirementStatus.VERIFIED)
    );
  }

  updateComplianceScore(): void {
    const totalRequirements = this.requirements.length;
    if (totalRequirements === 0) {
      this.complianceScore = 100;
      return;
    }

    const compliantCount = this.requirements.filter(
      req => req.status === ComplianceRequirementStatus.VERIFIED ||
            (!req.required && req.status !== ComplianceRequirementStatus.EXPIRED)
    ).length;

    this.complianceScore = Math.round((compliantCount / totalRequirements) * 100);
    this.updateStatus();
  }

  private updateStatus(): void {
    const nonCompliantReqs = this.getNonCompliantRequirements();
    
    if (nonCompliantReqs.length === 0) {
      this.status = ComplianceStatus.COMPLIANT;
      this.isSuspended = false;
      this.suspensionReason = null;
      this.suspendedAt = null;
    } else {
      this.status = ComplianceStatus.NON_COMPLIANT;
      
      // Check if any critical requirements are missing or expired
      const criticalIssues = nonCompliantReqs.some(req => 
        ['business_license', 'tax_certificate'].includes(req.name.toLowerCase())
      );
      
      if (criticalIssues && !this.isSuspended) {
        this.isSuspended = true;
        this.suspensionReason = 'Critical compliance requirements missing or expired';
        this.suspendedAt = new Date();
      }
    }
  }

  addHistoryItem(action: string, performedBy: string, details: Record<string, any> = {}): void {
    this.history = this.history || [];
    this.history.push({
      date: new Date(),
      action,
      performedBy,
      details,
    });
  }
}
