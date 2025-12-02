"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const business_entity_1 = require("./entities/business.entity");
const business_document_entity_1 = require("./entities/business-document.entity");
const business_verification_entity_1 = require("./entities/business-verification.entity");
const business_compliance_entity_1 = require("./entities/business-compliance.entity");
let BusinessService = class BusinessService {
    constructor(businessRepository, documentRepository, verificationRepository, complianceRepository) {
        this.businessRepository = businessRepository;
        this.documentRepository = documentRepository;
        this.verificationRepository = verificationRepository;
        this.complianceRepository = complianceRepository;
    }
    async create(createBusinessDto, userId) {
        const existingBusiness = await this.businessRepository.findOne({
            where: { registrationNumber: createBusinessDto.registrationNumber },
        });
        if (existingBusiness) {
            throw new common_1.BadRequestException('Business with this registration number already exists');
        }
        const business = this.businessRepository.create({
            ...createBusinessDto,
            status: business_entity_1.BusinessStatus.PENDING_VERIFICATION,
            createdBy: userId,
        });
        const verification = this.verificationRepository.create({
            status: business_verification_entity_1.VerificationStatus.PENDING,
            verificationMethod: business_verification_entity_1.VerificationMethod.MANUAL,
        });
        const compliance = this.complianceRepository.create({
            status: business_compliance_entity_1.ComplianceStatus.NON_COMPLIANT,
            complianceScore: 0,
            requirements: this.getDefaultComplianceRequirements(),
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
        const savedBusiness = await this.businessRepository.save(business);
        verification.businessId = savedBusiness.id;
        compliance.businessId = savedBusiness.id;
        await this.verificationRepository.save(verification);
        await this.complianceRepository.save(compliance);
        savedBusiness.verification = verification;
        savedBusiness.compliance = compliance;
        return this.businessRepository.save(savedBusiness);
    }
    async findAll(queryParams = {}) {
        const { status, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', complianceStatus, verificationStatus, } = queryParams;
        const skip = (page - 1) * limit;
        const query = this.businessRepository
            .createQueryBuilder('business')
            .leftJoinAndSelect('business.verification', 'verification')
            .leftJoinAndSelect('business.compliance', 'compliance')
            .leftJoinAndSelect('business.documents', 'documents')
            .where('business.isDeleted = :isDeleted', { isDeleted: false });
        if (status && status.length > 0) {
            query.andWhere('business.status IN (:...status)', { status });
        }
        if (search) {
            query.andWhere('(business.legalName LIKE :search OR business.tradeName LIKE :search OR business.registrationNumber LIKE :search)', { search: `%${search}%` });
        }
        if (complianceStatus && complianceStatus.length > 0) {
            query.andWhere('compliance.status IN (:...complianceStatus)', { complianceStatus });
        }
        if (verificationStatus && verificationStatus.length > 0) {
            query.andWhere('verification.status IN (:...verificationStatus)', { verificationStatus });
        }
        if (sortBy === 'complianceScore') {
            query.orderBy('compliance.complianceScore', sortOrder);
        }
        else if (sortBy === 'verificationStatus') {
            query.orderBy('verification.status', sortOrder);
        }
        else {
            query.orderBy(`business.${sortBy}`, sortOrder);
        }
        const [data, total] = await query.skip(skip).take(limit).getManyAndCount();
        return { data, total };
    }
    async findOne(id) {
        const business = await this.businessRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['verification', 'compliance', 'documents'],
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        return business;
    }
    async update(id, updateBusinessDto, userId) {
        const business = await this.findOne(id);
        const { status, verification, compliance, ...safeUpdates } = updateBusinessDto;
        Object.assign(business, safeUpdates);
        business.updatedBy = userId;
        return this.businessRepository.save(business);
    }
    async remove(id, userId) {
        const business = await this.findOne(id);
        business.isDeleted = true;
        business.updatedBy = userId;
        await this.businessRepository.save(business);
    }
    async addDocument(businessId, file, documentType, userId, metadata) {
        const business = await this.findOne(businessId);
        const document = this.documentRepository.create({
            businessId,
            type: documentType,
            name: file.originalname,
            fileUrl: file.path,
            fileType: file.mimetype,
            fileSize: file.size,
            status: business_document_entity_1.DocumentStatus.PENDING,
            metadata,
            uploadedBy: userId,
        });
        const savedDocument = await this.documentRepository.save(document);
        await this.updateComplianceRequirements(businessId, documentType);
        return savedDocument;
    }
    async verifyDocument(documentId, userId, status, reason) {
        const document = await this.documentRepository.findOne({
            where: { id: documentId },
            relations: ['business'],
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document with ID ${documentId} not found`);
        }
        if (status === 'approve') {
            document.status = business_document_entity_1.DocumentStatus.APPROVED;
            document.rejectionReason = null;
        }
        else {
            document.status = business_document_entity_1.DocumentStatus.REJECTED;
            document.rejectionReason = reason || 'Document rejected';
        }
        document.verifiedBy = userId;
        document.verifiedAt = new Date();
        const updatedDoc = await this.documentRepository.save(document);
        await this.updateComplianceStatus(document.businessId);
        return updatedDoc;
    }
    async verifyBusiness(businessId, userId, status, reason, method = business_verification_entity_1.VerificationMethod.MANUAL) {
        const business = await this.findOne(businessId);
        const verification = business.verification || await this.verificationRepository.findOne({ where: { businessId } });
        if (!verification) {
            throw new common_1.NotFoundException('Verification record not found');
        }
        if (status === 'approve') {
            verification.status = business_verification_entity_1.VerificationStatus.VERIFIED;
            verification.rejectionReason = null;
            business.status = business_entity_1.BusinessStatus.VERIFIED;
        }
        else {
            verification.status = business_verification_entity_1.VerificationStatus.REJECTED;
            verification.rejectionReason = reason || 'Verification rejected';
            business.status = business_entity_1.BusinessStatus.REJECTED;
        }
        verification.verifiedById = userId;
        verification.verifiedAt = new Date();
        verification.verificationMethod = method;
        await this.verificationRepository.save(verification);
        return this.businessRepository.save(business);
    }
    async updateComplianceStatus(businessId) {
        const compliance = await this.complianceRepository.findOne({
            where: { businessId },
            relations: ['business'],
        });
        if (!compliance) {
            throw new common_1.NotFoundException('Compliance record not found');
        }
        const documents = await this.documentRepository.find({
            where: {
                businessId,
                status: business_document_entity_1.DocumentStatus.APPROVED,
            },
        });
        compliance.requirements = compliance.requirements.map(req => {
            const document = documents.find(doc => doc.type === req.name);
            if (document) {
                req.status = business_compliance_entity_1.ComplianceRequirementStatus.VERIFIED;
                req.verifiedAt = new Date();
                req.verifiedBy = 'system';
            }
            else if (req.required && req.status === business_compliance_entity_1.ComplianceRequirementStatus.VERIFIED) {
                const expiryDate = new Date(req.verifiedAt);
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                if (new Date() > expiryDate) {
                    req.status = business_compliance_entity_1.ComplianceRequirementStatus.EXPIRED;
                }
            }
            return req;
        });
        compliance.updateComplianceScore();
        if (compliance.isSuspended) {
            const business = await this.findOne(businessId);
            business.status = business_entity_1.BusinessStatus.SUSPENDED;
            await this.businessRepository.save(business);
        }
        return this.complianceRepository.save(compliance);
    }
    async addComplianceRequirement(businessId, requirement, userId) {
        const compliance = await this.complianceRepository.findOne({ where: { businessId } });
        if (!compliance) {
            throw new common_1.NotFoundException('Compliance record not found');
        }
        const newRequirement = {
            id: Date.now().toString(),
            status: business_compliance_entity_1.ComplianceRequirementStatus.PENDING,
            ...requirement,
            addedBy: userId,
            addedAt: new Date(),
        };
        compliance.requirements = [...(compliance.requirements || []), newRequirement];
        compliance.updateComplianceScore();
        return this.complianceRepository.save(compliance);
    }
    getDefaultComplianceRequirements() {
        const now = new Date();
        const oneYearFromNow = new Date(now);
        oneYearFromNow.setFullYear(now.getFullYear() + 1);
        return [
            {
                id: 'bus_license',
                name: 'Business License',
                description: 'Valid business license from local authorities',
                required: true,
                status: business_compliance_entity_1.ComplianceRequirementStatus.PENDING,
                dueDate: oneYearFromNow,
            },
            {
                id: 'tax_cert',
                name: 'Tax Certificate',
                description: 'Tax registration certificate',
                required: true,
                status: business_compliance_entity_1.ComplianceRequirementStatus.PENDING,
                dueDate: oneYearFromNow,
            },
            {
                id: 'owner_id',
                name: 'Owner Identification',
                description: 'Government-issued ID of the business owner',
                required: true,
                status: business_compliance_entity_1.ComplianceRequirementStatus.PENDING,
            },
            {
                id: 'bank_account',
                name: 'Bank Account Verification',
                description: 'Proof of business bank account',
                required: true,
                status: business_compliance_entity_1.ComplianceRequirementStatus.PENDING,
            },
        ];
    }
    async getBusinessStats() {
        const [totalBusinesses, verifiedBusinesses, pendingVerification, nonCompliant] = await Promise.all([
            this.businessRepository.count({ where: { isDeleted: false } }),
            this.businessRepository.count({
                where: {
                    status: business_entity_1.BusinessStatus.VERIFIED,
                    isDeleted: false,
                },
            }),
            this.businessRepository.count({
                where: {
                    'verification.status': business_verification_entity_1.VerificationStatus.PENDING,
                    isDeleted: false,
                },
            }),
            this.complianceRepository.count({
                where: {
                    status: business_compliance_entity_1.ComplianceStatus.NON_COMPLIANT,
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
    async getUpcomingRenewals(days = 30) {
        const businesses = await this.businessRepository.find({
            where: {
                isDeleted: false,
                status: (0, typeorm_2.Not)(business_entity_1.BusinessStatus.REJECTED),
            },
            relations: ['compliance', 'verification'],
        });
        const now = new Date();
        const threshold = new Date(now);
        threshold.setDate(now.getDate() + days);
        return businesses
            .map(business => {
            var _a;
            if (!((_a = business.compliance) === null || _a === void 0 ? void 0 : _a.requirements))
                return null;
            const expiringRequirements = business.compliance.requirements.filter(req => {
                if (!req.dueDate)
                    return false;
                const dueDate = new Date(req.dueDate);
                return dueDate <= threshold && dueDate >= now;
            });
            return expiringRequirements.length > 0
                ? { business, expiringRequirements }
                : null;
        })
            .filter(Boolean);
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __param(1, (0, typeorm_1.InjectRepository)(business_document_entity_1.BusinessDocument)),
    __param(2, (0, typeorm_1.InjectRepository)(business_verification_entity_1.BusinessVerification)),
    __param(3, (0, typeorm_1.InjectRepository)(business_compliance_entity_1.BusinessCompliance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BusinessService);
//# sourceMappingURL=business.service.js.map