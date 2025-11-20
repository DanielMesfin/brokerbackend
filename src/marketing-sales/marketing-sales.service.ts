import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing, ListingStatus } from './entities/listing.entity';

type ListingWithRelations = Listing & {
  user: {
    id: string;
    displayName: string | null;
    email: string;
  };
};

@Injectable()
export class MarketingSalesService {
  constructor(private prisma: PrismaService) {}

  async createListing(userId: string, createListingDto: CreateListingDto): Promise<Listing> {
    const listing = await this.prisma.listing.create({
      data: {
        ...createListingDto,
        userId,
        tags: JSON.stringify(createListingDto.tags || []),
        imageUrls: createListingDto.imageUrls ? JSON.stringify(createListingDto.imageUrls) : null,
        status: 'PENDING',
      },
    });

    return this.mapListingWithRelations(listing);
  }

  async findAllListings(status?: string): Promise<ListingWithRelations[]> {
    const where = status ? { status } : {};
    const listings = await this.prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return listings.map(listing => this.mapListingWithRelations(listing));
  }

  async findListingById(id: string): Promise<ListingWithRelations> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID "${id}" not found`);
    }

    return this.mapListingWithRelations(listing);
  }

  async updateListing(
    id: string,
    updateData: Partial<CreateListingDto>,
    userId: string,
    isAdmin = false,
  ): Promise<ListingWithRelations> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID "${id}" not found`);
    }

    if (listing.userId !== userId && !isAdmin) {
      throw new ForbiddenException('You do not have permission to update this listing');
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.tags && { tags: JSON.stringify(updateData.tags) }),
        ...(updateData.imageUrls && { imageUrls: JSON.stringify(updateData.imageUrls) }),
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return this.mapListingWithRelations(updatedListing);
  }

  async removeListing(id: string, userId: string, isAdmin = false): Promise<void> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID "${id}" not found`);
    }

    if (listing.userId !== userId && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this listing');
    }

    await this.prisma.listing.delete({
      where: { id },
    });
  }

  async updateListingStatus(id: string, status: ListingStatus, adminId: string): Promise<Listing> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID "${id}" not found`);
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: { status },
    });

    return this.mapListing(updatedListing);
  }

  async searchListings(query: string, filters: Record<string, any> = {}): Promise<ListingWithRelations[]> {
    const { category, type, minPrice, maxPrice, ...restFilters } = filters;
    
    const where: any = {
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
      ...(type && { type }),
      ...(minPrice !== undefined && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice !== undefined && { price: { lte: parseFloat(maxPrice) } }),
      ...restFilters,
    };

    const listings = await this.prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return listings.map(listing => this.mapListingWithRelations(listing));
  }

  private mapListing(listing: any): Listing {
    // Create a new Listing instance with all the properties
    const listingInstance = new Listing({
      ...listing,
      tags: listing.tags || '[]',
      imageUrls: listing.imageUrls || '[]',
      createdAt: new Date(listing.createdAt),
      updatedAt: new Date(listing.updatedAt),
    });
    
    return listingInstance;
  }

  private mapListingWithRelations(listing: any): ListingWithRelations {
    const listingInstance = this.mapListing(listing);
    return {
      ...listingInstance,
      user: listing.user,
      // Ensure we have all Listing methods
      getTags: listingInstance.getTags.bind(listingInstance),
      getImageUrls: listingInstance.getImageUrls.bind(listingInstance)
    };
  }
}
