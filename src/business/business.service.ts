import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Business, BusinessStatus, BusinessType } from './entities/business.entity';
import { BusinessDocument, DocumentType, DocumentStatus } from './entities/business-document.entity';
import { BusinessVerification, VerificationStatus, VerificationMethod } from './entities/business-verification.entity';
import { BusinessCompliance, ComplianceStatus, ComplianceRequirementStatus } from './entities/business-compliance.entity';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';

export interface BusinessQueryParams {
  status?: BusinessStatus[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  complianceStatus?: ComplianceStatus[];
  verificationStatus?: VerificationStatus[];
}

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessDocument)
    private readonly documentRepository: Repository<BusinessDocument>,
    @InjectRepository(BusinessVerification)
    private readonly verificationRepository: Repository<BusinessVerification>,
    @InjectRepository(BusinessCompliance)
    private readonly complianceRepository: Repository<BusinessCompliance>,
  ) {}

  // Business CRUD
  async create(createBusinessDto: CreateBusinessDto, userId: string): Promise<Business> {
    // Check if business with same registration number already exists
    const existingBusiness = await this.businessRepository.findOne({
      where: { registrationNumber: createBusinessDto.registrationNumber },
    });

    if (existingBusiness) {
      throw new BadRequestException('Business with this registration number already exists');
    }

    // Start a transaction
    return this.businessRepository.manager.transaction(async (transactionalEntityManager) => {
      // Create and save business first
      const business = this.businessRepository.create({
        ...createBusinessDto,
        status: BusinessStatus.PENDING_VERIFICATION,
        createdBy: userId,
      });
      
      const savedBusiness = await transactionalEntityManager.save(Business, business);

      // Create verification record
      const verification = this.verificationRepository.create({
        status: VerificationStatus.PENDING,
        verificationMethod: VerificationMethod.MANUAL,
        business: savedBusiness,
        businessId: savedBusiness.id,
      });

      // Create compliance record with default requirements
      const compliance = this.complianceRepository.create({
        status: ComplianceStatus.NON_COMPLIANT,
        complianceScore: 0,
        requirements: this.getDefaultComplianceRequirements(),
        business: savedBusiness,
        businessId: savedBusiness.id,
        settings: {
          autoSuspend: true,
          notifyDaysBeforeExpiry: [30, 15, 7, 1],
          notifyOn: {
            email: true,
            sms: true,
            inApp: true,
          },
          gracePeriodDays: 7,
        },
      });

      // Save verification and compliance
      const [savedVerification, savedCompliance] = await Promise.all([
        transactionalEntityManager.save(BusinessVerification, verification),
        transactionalEntityManager.save(BusinessCompliance, compliance)
      ]);

      // Update business with relations
      savedBusiness.verification = savedVerification;
      savedBusiness.compliance = savedCompliance;

      // Save the business with relations
      return transactionalEntityManager.save(Business, savedBusiness);
    });
  }

  async findAll(queryParams: BusinessQueryParams = {}): Promise<{ data: Business[]; total: number }> {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      complianceStatus,
      verificationStatus,
    } = queryParams;

    const skip = (page - 1) * limit;
    const query = this.businessRepository
      .createQueryBuilder('business')
      .leftJoinAndSelect('business.verification', 'verification')
      .leftJoinAndSelect('business.compliance', 'compliance')
      .leftJoinAndSelect('business.documents', 'documents')
      .where('business.isDeleted = :isDeleted', { isDeleted: false });

    // Apply filters
    if (status && status.length > 0) {
      query.andWhere('business.status IN (:...status)', { status });
    }

    if (search) {
      query.andWhere(
        '(business.legalName LIKE :search OR business.tradeName LIKE :search OR business.registrationNumber LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (complianceStatus && complianceStatus.length > 0) {
      query.andWhere('compliance.status IN (:...complianceStatus)', { complianceStatus });
    }

    if (verificationStatus && verificationStatus.length > 0) {
      query.andWhere('verification.status IN (:...verificationStatus)', { verificationStatus });
    }

    // Apply sorting
    if (sortBy === 'complianceScore') {
      query.orderBy('compliance.complianceScore', sortOrder);
    } else if (sortBy === 'verificationStatus') {
      query.orderBy('verification.status', sortOrder);
    } else {
      query.orderBy(`business.${sortBy}`, sortOrder);
    }

    // Get results and total count
    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['verification', 'compliance', 'documents'],
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto, userId: string): Promise<Business> {
    const business = await this.findOne(id);
    
    // Handle status changes
    if ('status' in updateBusinessDto) {
      if (updateBusinessDto.status === BusinessStatus.SUSPENDED) {
        business.status = BusinessStatus.SUSPENDED;
        // Cast to any to access potential custom fields
        const dto = updateBusinessDto as any;
        business.suspensionReason = dto.suspensionReason || 'Business suspended';
        business.suspendedAt = new Date();
      } else if (business.status === BusinessStatus.SUSPENDED && updateBusinessDto.status === BusinessStatus.VERIFIED) {
        // Reactivating a suspended business
        business.status = BusinessStatus.VERIFIED;
        business.suspensionReason = null;
        business.suspendedAt = null;
      } else {
        business.status = updateBusinessDto.status;
      }
    }
    
    // Update other fields
    const { status, verification, compliance, ...safeUpdates } = updateBusinessDto;
    Object.assign(business, safeUpdates);
    
    business.updatedBy = userId;
    
    return this.businessRepository.save(business);
  }

  async remove(id: string, userId: string): Promise<void> {
    const business = await this.findOne(id);
    business.isDeleted = true;
    business.updatedBy = userId;
    await this.businessRepository.save(business);
  }

  // Document Management
  async addDocument(
    businessId: string, 
    file: Express.Multer.File, 
    documentType: DocumentType,
    userId: string,
    metadata?: Record<string, any>,
  ): Promise<BusinessDocument> {
    const business = await this.findOne(businessId);
    
    const document = this.documentRepository.create({
      businessId,
      type: documentType,
      name: file.originalname,
      fileUrl: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      status: DocumentStatus.PENDING,
      metadata,
      uploadedBy: userId,
    });

    const savedDocument = await this.documentRepository.save(document);
    
    // Update compliance requirements if this document satisfies any
    await this.addComplianceRequirement(businessId, documentType);
    
    return savedDocument;
  }

  async verifyDocument(documentId: string, userId: string, status: 'approve' | 'reject', reason?: string): Promise<BusinessDocument> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['business'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    if (status === 'approve') {
      document.status = DocumentStatus.APPROVED;
      document.rejectionReason = undefined;
    } else {
      document.status = DocumentStatus.REJECTED;
      document.rejectionReason = reason || 'Document rejected';
    }

    document.verifiedBy = userId;
    document.verifiedAt = new Date();

    const updatedDoc = await this.documentRepository.save(document);
    
    // Update compliance status after document verification
    await this.updateComplianceStatus(document.businessId);
    
    return updatedDoc;
  }

  async updateComplianceStatus(businessId: string): Promise<BusinessCompliance> {
    const business = await this.findOne(businessId);
    let compliance = business.compliance;
    
    if (!compliance) {
      compliance = this.complianceRepository.create({
        businessId,
        status: ComplianceStatus.NON_COMPLIANT,
        complianceScore: 0,
        requirements: this.getDefaultComplianceRequirements(),
        settings: {},
        history: [],
        riskFactors: {
          highRiskDocuments: [],
          expiredDocuments: [],
          missingDocuments: [],
          pendingVerification: []
        },
        lastComplianceCheck: new Date()
      });
      return this.complianceRepository.save(compliance);
    }

    const requirements = compliance.requirements || [];
    const totalRequirements = requirements.length;
    const completedRequirements = requirements.filter(r => r.status === ComplianceRequirementStatus.VERIFIED).length;
    
    // Calculate compliance score (0-100)
    const complianceScore = totalRequirements > 0 
      ? Math.round((completedRequirements / totalRequirements) * 100) 
      : 0;

    // Update compliance entity
    compliance.complianceScore = complianceScore;
    
    // Update status based on score
    let newStatus = compliance.status;
    if (complianceScore === 100) {
      newStatus = ComplianceStatus.COMPLIANT;
    } else if (complianceScore >= 70) {
      newStatus = ComplianceStatus.AT_RISK;
    } else {
      newStatus = ComplianceStatus.NON_COMPLIANT;
    }
    
    // Only update if changed
    if (complianceScore !== compliance.complianceScore || newStatus !== compliance.status) {
      compliance.complianceScore = complianceScore;
      compliance.status = newStatus;
      await this.complianceRepository.save(compliance);
    }
  }

  // Verification Management
  async verifyBusiness(
    businessId: string, 
    userId: string, 
    status: 'approve' | 'reject', 
    reason?: string,
    method: VerificationMethod = VerificationMethod.MANUAL,
  ): Promise<Business> {
    const business = await this.findOne(businessId);
    const verification = business.verification || await this.verificationRepository.findOne({ where: { businessId } });

    if (!verification) {
      throw new NotFoundException('Verification record not found');
    }

    if (status === 'approve') {
      verification.status = VerificationStatus.VERIFIED;
      verification.rejectionReason = null;
      business.status = BusinessStatus.VERIFIED;
    } else {
      verification.status = VerificationStatus.REJECTED;
      verification.rejectionReason = reason || 'Verification rejected';
      business.status = BusinessStatus.REJECTED;
    }

    verification.verifiedById = userId;
    verification.verifiedAt = new Date();
    verification.verificationMethod = method;

    await this.verificationRepository.save(verification);
    return this.businessRepository.save(business);
  }

  // Compliance Management
  async updateComplianceStatus(businessId: string): Promise<BusinessCompliance> {
    const compliance = await this.complianceRepository.findOne({ 
      where: { businessId },
      relations: ['business'],
    });

    if (!compliance) {
      throw new NotFoundException('Compliance record not found');
    }

    // Get all documents for this business
    const documents = await this.documentRepository.find({ 
      where: { 
        businessId,
        status: DocumentStatus.APPROVED,
      },
    });

    // Update compliance requirements based on documents
    compliance.requirements = compliance.requirements.map(req => {
      const document = documents.find(doc => doc.type === req.name);
      
      if (document) {
        req.status = ComplianceRequirementStatus.VERIFIED;
        req.verifiedAt = new Date();
        req.verifiedBy = 'system';
      } else if (req.required && req.status === ComplianceRequirementStatus.VERIFIED) {
        // Check if verification has expired
        const expiryDate = new Date(req.verifiedAt);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Assuming 1 year validity
        
        if (new Date() > expiryDate) {
          req.status = ComplianceRequirementStatus.EXPIRED;
        }
      }
      
      return req;
    });

    // Recalculate compliance score
    compliance.updateComplianceScore();
    
    // Update business status if needed
    if (compliance.isSuspended) {
      const business = await this.findOne(businessId);
      business.status = BusinessStatus.SUSPENDED;
      await this.businessRepository.save(business);
    }

    return this.complianceRepository.save(compliance);
  }

  async addComplianceRequirement(
    businessId: string, 
    requirement: {
      name: string;
      description: string;
      required: boolean;
      dueDate?: Date;
    },
    userId: string,
  ): Promise<BusinessCompliance> {
    const compliance = await this.complianceRepository.findOne({ where: { businessId } });
    
    if (!compliance) {
      throw new NotFoundException('Compliance record not found');
    }

    const newRequirement: any = {
      id: Date.now().toString(),
      status: ComplianceRequirementStatus.PENDING,
      ...requirement,
      addedBy: userId,
      addedAt: new Date(),
    };

    compliance.requirements = [...(compliance.requirements || []), newRequirement];
    compliance.updateComplianceScore();
    
    return this.complianceRepository.save(compliance);
  }

  // Helper Methods
  private getDefaultComplianceRequirements(): any[] {
    const now = new Date();
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    return [
      {
        id: 'bus_license',
        name: 'Business License',
        description: 'Valid business license from local authorities',
        required: true,
        status: ComplianceRequirementStatus.PENDING,
        dueDate: oneYearFromNow,
      },
      {
        id: 'tax_cert',
        name: 'Tax Certificate',
        description: 'Tax registration certificate',
        required: true,
        status: ComplianceRequirementStatus.PENDING,
        dueDate: oneYearFromNow,
      },
      {
        id: 'owner_id',
        name: 'Owner Identification',
        description: 'Government-issued ID of the business owner',
        required: true,
        status: ComplianceRequirementStatus.PENDING,
      },
      {
        id: 'bank_account',
        name: 'Bank Account Verification',
        description: 'Proof of business bank account',
        required: true,
        status: ComplianceRequirementStatus.PENDING,
      },
    ];
  }

  // Analytics and Reporting
  async getBusinessStats() {
    const [totalBusinesses, verifiedBusinesses, pendingVerification, nonCompliant] = await Promise.all([
      this.businessRepository.count({ where: { isDeleted: false } }),
      this.businessRepository.count({ 
        where: { 
          status: BusinessStatus.VERIFIED,
          isDeleted: false,
        },
      }),
      this.businessRepository.count({
        where: {
          'verification.status': VerificationStatus.PENDING,
          isDeleted: false,
        },
      }),
      this.complianceRepository.count({
        where: {
          status: ComplianceStatus.NON_COMPLIANT,
          business: { isDeleted: false },
        },
      }),
    ]);

    return {
      totalBusinesses,
      verifiedBusinesses,
      pendingVerification,
      nonCompliant,
      complianceRate: totalBusinesses > 0 
        ? Math.round(((totalBusinesses - nonCompliant) / totalBusinesses) * 100) 
        : 0,
    };
  }

  async getUpcomingRenewals(days = 30): Promise<{business: Business; expiringRequirements: any[]}[]> {
    const businesses = await this.businessRepository.find({
      where: { 
        isDeleted: false,
        status: Not(BusinessStatus.REJECTED),
      },
      relations: ['compliance', 'verification'],
    });

    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(now.getDate() + days);

    return businesses
      .map(business => {
        if (!business.compliance?.requirements) return null;
        
        const expiringRequirements = business.compliance.requirements.filter(req => {
          if (!req.dueDate) return false;
          const dueDate = new Date(req.dueDate);
          return dueDate <= threshold && dueDate >= now;
        });

        return expiringRequirements.length > 0 
          ? { business, expiringRequirements } 
          : null;
      })
      .filter(Boolean);
  }
}
