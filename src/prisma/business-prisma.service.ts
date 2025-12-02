import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

type BusinessWithRelations = Prisma.BusinessGetPayload<{
  include: {
    members: {
      include: {
        user: true;
      };
    };
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
    }) as unknown as BusinessWithRelations;
  }

  async findBusiness(
    where: Prisma.BusinessWhereUniqueInput,
    includeRelations: boolean = true
  ): Promise<BusinessWithRelations | Prisma.BusinessGetPayload<{}> | null> {
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
    
    return business as unknown as BusinessWithRelations | null;
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
    }) as unknown as BusinessWithRelations;
  }

  async deleteBusiness(where: Prisma.BusinessWhereUniqueInput): Promise<BusinessWithRelations> {
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
    }) as unknown as BusinessWithRelations;
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
  async createVerification(data: Prisma.VerificationCodeCreateInput) {
    return this.prisma.verificationCode.create({ 
      data,
      include: {
        user: true
      }
    });
  }

  async updateVerificationStatus(params: {
  where: { id: string };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verifiedById?: string;
  notes?: string;
}) {
  const { where, status, verifiedById, notes } = params;
  
  // Create a properly typed update data object
  const updateData: Prisma.VerificationCodeUpdateInput = {
    status: status as any, // Type assertion needed due to Prisma's generated types
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
  async recordComplianceAcceptance(data: {
    businessId: string;
    acceptedById?: string;
    complianceType: string;
    version?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
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
        members: {
          include: {
            user: true
          }
        },
        documents: true,
        verifications: true
      }
    }) as unknown as BusinessWithRelations[];
  }
}
