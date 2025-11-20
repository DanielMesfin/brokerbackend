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
exports.MarketingSalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const listing_entity_1 = require("./entities/listing.entity");
let MarketingSalesService = class MarketingSalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createListing(userId, createListingDto) {
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
    async findAllListings(status) {
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
    async findListingById(id) {
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
            throw new common_1.NotFoundException(`Listing with ID "${id}" not found`);
        }
        return this.mapListingWithRelations(listing);
    }
    async updateListing(id, updateData, userId, isAdmin = false) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException(`Listing with ID "${id}" not found`);
        }
        if (listing.userId !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to update this listing');
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
    async removeListing(id, userId, isAdmin = false) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException(`Listing with ID "${id}" not found`);
        }
        if (listing.userId !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to delete this listing');
        }
        await this.prisma.listing.delete({
            where: { id },
        });
    }
    async updateListingStatus(id, status, adminId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException(`Listing with ID "${id}" not found`);
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: { status },
        });
        return this.mapListing(updatedListing);
    }
    async searchListings(query, filters = {}) {
        const { category, type, minPrice, maxPrice, ...restFilters } = filters;
        const where = {
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
    mapListing(listing) {
        const listingInstance = new listing_entity_1.Listing({
            ...listing,
            tags: listing.tags || '[]',
            imageUrls: listing.imageUrls || '[]',
            createdAt: new Date(listing.createdAt),
            updatedAt: new Date(listing.updatedAt),
        });
        return listingInstance;
    }
    mapListingWithRelations(listing) {
        const listingInstance = this.mapListing(listing);
        return {
            ...listingInstance,
            user: listing.user,
            getTags: listingInstance.getTags.bind(listingInstance),
            getImageUrls: listingInstance.getImageUrls.bind(listingInstance)
        };
    }
};
exports.MarketingSalesService = MarketingSalesService;
exports.MarketingSalesService = MarketingSalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketingSalesService);
//# sourceMappingURL=marketing-sales.service.js.map