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
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const business_service_1 = require("./business.service");
const business_dto_1 = require("./dto/business.dto");
const business_document_entity_1 = require("./entities/business-document.entity");
const business_entity_1 = require("./entities/business.entity");
const business_verification_entity_1 = require("./entities/business-verification.entity");
const business_compliance_entity_1 = require("./entities/business-compliance.entity");
let BusinessController = class BusinessController {
    constructor(businessService) {
        this.businessService = businessService;
    }
    async create(createBusinessDto, req) {
        return this.businessService.create(createBusinessDto, req.user.id);
    }
    async findAll(query) {
        return this.businessService.findAll(query);
    }
    async getStats() {
        return this.businessService.getBusinessStats();
    }
    getBusinessTypes() {
        return Object.entries(business_entity_1.BusinessType).map(([key, value]) => ({
            value,
            label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
        }));
    }
    getBusinessStatuses() {
        return Object.entries(business_entity_1.BusinessStatus).map(([key, value]) => ({
            value,
            label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
        }));
    }
    getVerificationStatuses() {
        return Object.entries(business_verification_entity_1.VerificationStatus).map(([key, value]) => ({
            value,
            label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
        }));
    }
    getComplianceStatuses() {
        return Object.entries(business_compliance_entity_1.ComplianceStatus)
            .filter(([key]) => key !== 'COMPLIANCE_STATUS')
            .map(([key, value]) => ({
            value: value,
            label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
        }));
    }
    getDocumentTypes() {
        return Object.entries(business_document_entity_1.DocumentType).map(([key, value]) => ({
            value,
            label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
        }));
    }
    async findOne(id) {
        return this.businessService.findOne(id);
    }
    async update(id, updateBusinessDto, req) {
        return this.businessService.update(id, updateBusinessDto, req.user.id);
    }
    async remove(id, req) {
        return this.businessService.remove(id, req.user.id);
    }
    async uploadDocument(id, file, type, req, issueDate, expiryDate) {
        if (!Object.values(business_document_entity_1.DocumentType).includes(type)) {
            throw new common_1.BadRequestException('Invalid document type');
        }
        const metadata = {};
        if (issueDate)
            metadata.issueDate = new Date(issueDate);
        if (expiryDate)
            metadata.expiryDate = new Date(expiryDate);
        return this.businessService.addDocument(id, file, type, req.user.id, metadata);
    }
    async verifyDocument(documentId, req, status, reason) {
        return this.businessService.verifyDocument(documentId, req.user.id, status, reason);
    }
    async verifyBusiness(id, status, reason, req) {
        return this.businessService.verifyBusiness(id, req.user.id, status, reason);
    }
    async getComplianceStatus(id) {
        const business = await this.businessService.findOne(id);
        return business.compliance;
    }
    async addComplianceRequirement(id, requirement, req) {
        return this.businessService.addComplianceRequirement(id, requirement, req.user.id);
    }
    async getUpcomingRenewals(days = '30') {
        return this.businessService.getUpcomingRenewals(parseInt(days, 10));
    }
    async getDashboardStats() {
        const stats = await this.businessService.getBusinessStats();
        const upcomingRenewals = await this.businessService.getUpcomingRenewals(30);
        return {
            ...stats,
            upcomingRenewals: upcomingRenewals.length,
        };
    }
    async suspendBusiness(id, reason, req) {
        const business = await this.businessService.findOne(id);
        if (business.status === business_entity_1.BusinessStatus.SUSPENDED) {
            throw new common_1.BadRequestException('Business is already suspended');
        }
        return this.businessService.update(id, {
            status: business_entity_1.BusinessStatus.SUSPENDED,
            suspensionReason: reason,
            suspendedAt: new Date(),
        }, req.user.id);
    }
    async activateBusiness(id, req) {
        const business = await this.businessService.findOne(id);
        if (business.status !== business_entity_1.BusinessStatus.SUSPENDED) {
            throw new common_1.BadRequestException('Business is not suspended');
        }
        return this.businessService.update(id, {
            status: business_entity_1.BusinessStatus.VERIFIED,
            suspensionReason: undefined,
            suspendedAt: undefined,
        }, req.user.id);
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new business' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Business registered successfully', type: business_dto_1.BusinessResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_dto_1.CreateBusinessDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all businesses with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of businesses', type: [business_dto_1.BusinessResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_dto_1.BusinessQueryDto]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business statistics', type: business_dto_1.BusinessStatsResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all business types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of business types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BusinessController.prototype, "getBusinessTypes", null);
__decorate([
    (0, common_1.Get)('statuses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all business statuses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of business statuses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BusinessController.prototype, "getBusinessStatuses", null);
__decorate([
    (0, common_1.Get)('verification-statuses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all verification statuses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of verification statuses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BusinessController.prototype, "getVerificationStatuses", null);
__decorate([
    (0, common_1.Get)('compliance-statuses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all compliance statuses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of compliance statuses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BusinessController.prototype, "getComplianceStatuses", null);
__decorate([
    (0, common_1.Get)('document-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all document types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of document types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BusinessController.prototype, "getDocumentTypes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a business by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business details', type: business_dto_1.BusinessResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business updated successfully', type: business_dto_1.BusinessResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, business_dto_1.UpdateBusinessDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a document for a business' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                type: {
                    type: 'string',
                    enum: Object.values(business_document_entity_1.DocumentType),
                    description: 'Type of document',
                },
                issueDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Document issue date (YYYY-MM-DD)',
                },
                expiryDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Document expiry date (YYYY-MM-DD)',
                },
            },
            required: ['file', 'type'],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Document uploaded successfully', type: business_dto_1.DocumentUploadResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file or input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: '.(pdf|doc|docx|jpg|jpeg|png)' }),
        ],
    }))),
    __param(2, (0, common_1.Body)('type')),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.Body)('issueDate')),
    __param(5, (0, common_1.Body)('expiryDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Object, String, String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Post)('documents/:documentId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a business document' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document verification status updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "verifyDocument", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business verification status updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('reason')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "verifyBusiness", null);
__decorate([
    (0, common_1.Get)(':id/compliance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business compliance status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getComplianceStatus", null);
__decorate([
    (0, common_1.Post)(':id/compliance/requirements'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a compliance requirement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Compliance requirement added' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, business_dto_1.ComplianceRequirementUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "addComplianceRequirement", null);
__decorate([
    (0, common_1.Get)('upcoming-renewals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming document renewals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of upcoming renewals' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getUpcomingRenewals", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend a business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business suspended' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Business already suspended' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "suspendBusiness", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a suspended business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business activated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Business is not suspended' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "activateBusiness", null);
exports.BusinessController = BusinessController = __decorate([
    (0, swagger_1.ApiTags)('Businesses'),
    (0, common_1.Controller)('businesses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [business_service_1.BusinessService])
], BusinessController);
//# sourceMappingURL=business.controller.js.map