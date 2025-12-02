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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPrismaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let BusinessPrismaService = class BusinessPrismaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBusiness(data) {
        return this.prisma.business.create({
            data,
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                listings: true,
                documents: true,
                verifications: true,
                compliances: true
            }
        });
    }
    async findBusiness(where, includeRelations = true) {
        const business = await this.prisma.business.findUnique({
            where,
            include: includeRelations ? {
                members: {
                    include: {
                        user: true
                    }
                },
                listings: true,
                documents: true,
                verifications: true,
                compliances: true
            } : undefined
        });
        return business;
    }
    async updateBusiness(params) {
        const { where, data } = params;
        return this.prisma.business.update({
            where,
            data,
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                listings: true,
                documents: true,
                verifications: true,
                compliances: true
            }
        });
    }
    async deleteBusiness(where) {
        return this.prisma.business.delete({
            where,
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                listings: true,
                documents: true,
                verifications: true,
                compliances: true
            }
        });
    }
    async addBusinessMember(data) {
        return this.prisma.businessMember.create({
            data,
            include: {
                user: true,
                business: true
            }
        });
    }
    async removeBusinessMember(where) {
        return this.prisma.businessMember.delete({
            where,
            include: {
                user: true,
                business: true
            }
        });
    }
    async createVerification(data) {
        return this.prisma.verificationCode.create({
            data,
            include: {
                user: true
            }
        });
    }
    async updateVerificationStatus(params) {
        const { where, status, verifiedById, notes } = params;
        const updateData = {
            status: status,
            ...(status === 'APPROVED' && { verifiedAt: new Date() }),
            ...(verifiedById && { verifiedBy: { connect: { id: verifiedById } } }),
            ...(notes && { notes })
        };
        return this.prisma.verificationCode.update({
            where,
            data: updateData,
            include: {
                user: true
            }
        });
    }
    async uploadDocument(data) {
        return this.prisma.businessDocument.create({
            data,
            include: {
                business: true
            }
        });
    }
    async getDocument(where) {
        return this.prisma.businessDocument.findUnique({
            where,
            include: {
                business: true
            }
        });
    }
    async updateDocument(params) {
        return this.prisma.businessDocument.update({
            ...params,
            include: {
                business: true
            }
        });
    }
    async deleteDocument(where) {
        return this.prisma.businessDocument.delete({
            where,
            include: {
                business: true
            }
        });
    }
    async recordComplianceAcceptance(data) {
        return this.prisma.businessCompliance.create({
            data: {
                business: { connect: { id: data.businessId } },
                ...(data.acceptedById ? { acceptedBy: { connect: { id: data.acceptedById } } } : {}),
                complianceType: data.complianceType,
                version: data.version,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent
            },
            include: {
                business: true,
                acceptedBy: true
            }
        });
    }
    async getBusinessCompliance(businessId) {
        return this.prisma.businessCompliance.findMany({
            where: { businessId },
            include: {
                business: true,
                acceptedBy: true
            },
            orderBy: {
                acceptedAt: 'desc'
            }
        });
    }
    async searchBusinesses(params) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.business.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                documents: true,
                verifications: true
            }
        });
    }
};
exports.BusinessPrismaService = BusinessPrismaService;
exports.BusinessPrismaService = BusinessPrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessPrismaService);
//# sourceMappingURL=business-prisma.service.js.map