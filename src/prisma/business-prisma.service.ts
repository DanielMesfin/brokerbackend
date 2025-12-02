import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

type BusinessWithRelations = Prisma.BusinessGetPayload<{
  include: {
    members: true;
    listings: true;
    documents: true;
    verifications: true;
    compliances: true;
  };
}>;

@Injectable()
export class BusinessPrismaService {
  constructor(private prisma: PrismaService) {}

  // Business CRUD operations
  async createBusiness(data: Prisma.BusinessCreateInput): Promise<BusinessWithRelations> {
    return this.prisma.business.create({ 
      data,
      include: {
        members: true,
        listings: true,
        documents: true,
        verifications: true,
        compliances: true
      }
    });
  }

  async findBusiness(
    where: Prisma.BusinessWhereUniqueInput,
    includeRelations: boolean = true
  ): Promise<BusinessWithRelations | null> {
    return this.prisma.business.findUnique({ 
      where,
      include: includeRelations ? {
        members: true,
        listings: true,
        documents: true,
        verifications: true,
        compliances: true
      } : undefined
    });
  }

  async updateBusiness(params: {
    where: Prisma.BusinessWhereUniqueInput;
    data: Prisma.BusinessUpdateInput;
  }): Promise<BusinessWithRelations> {
    const { where, data } = params;
    return this.prisma.business.update({ 
      where, 
      data,
      include: {
        members: true,
        listings: true,
        documents: true,
        verifications: true,
        compliances: true
      }
    });
  }

  async deleteBusiness(where: Prisma.BusinessWhereUniqueInput): Promise<BusinessWithRelations> {
    return this.prisma.business.delete({ 
      where,
      include: {
        members: true,
        listings: true,
        documents: true,
        verifications: true,
        compliances: true
      }
    });
  }

  // Business Member operations
  async addBusinessMember(data: Prisma.BusinessMemberCreateInput) {
    return this.prisma.businessMember.create({ 
      data,
      include: {
        user: true,
        business: true
      }
    });
  }

  async removeBusinessMember(where: Prisma.BusinessMemberWhereUniqueInput) {
    return this.prisma.businessMember.delete({ 
      where,
      include: {
        user: true,
        business: true
      }
    });
  }

  // Business Verification operations
  async createVerification(data: any) {
    return this.prisma.verificationCode.create({ 
      data,
      include: {
        user: true
      }
    });
  }

  async updateVerificationStatus(params: {
    where: { id: string };
    status: string;
    verifiedById?: string;
    notes?: string;
  }) {
    const { where, status, verifiedById, notes } = params;
    return this.prisma.verificationCode.update({
      where,
      data: {
        status,
        verifiedAt: status === 'APPROVED' ? new Date() : undefined,
        verifiedById,
        notes
      },
      include: {
        user: true
      }
    });
  }

  // Document management
  async uploadDocument(data: Prisma.BusinessDocumentCreateInput) {
    return this.prisma.businessDocument.create({ 
      data,
      include: {
        business: true
      }
    });
  }

  async getDocument(where: Prisma.BusinessDocumentWhereUniqueInput) {
    return this.prisma.businessDocument.findUnique({ 
      where,
      include: {
        business: true
      }
    });
  }

  async updateDocument(params: {
    where: Prisma.BusinessDocumentWhereUniqueInput;
    data: Prisma.BusinessDocumentUpdateInput;
  }) {
    return this.prisma.businessDocument.update({
      ...params,
      include: {
        business: true
      }
    });
  }

  async deleteDocument(where: { id: string }) {
    return this.prisma.businessDocument.delete({ 
      where,
      include: {
        business: true
      }
    });
  }

  // Compliance operations
  async recordComplianceAcceptance(data: Prisma.BusinessComplianceCreateInput) {
    return this.prisma.businessCompliance.create({
      data,
      include: {
        business: true,
        acceptedBy: true
      }
    });
  }

  async getBusinessCompliance(businessId: string) {
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

  // Search and list businesses with filters
  async searchBusinesses(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BusinessWhereUniqueInput;
    where?: Prisma.BusinessWhereInput;
    orderBy?: Prisma.BusinessOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.business.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        members: true,
        documents: true,
        verifications: true
      }
    });
  }
}
