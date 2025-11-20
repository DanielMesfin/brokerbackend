import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery, 
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { MarketingSalesService } from './marketing-sales.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing, ListingStatus } from './entities/listing.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@ApiTags('Marketing & Sales')
@ApiBearerAuth()
@Controller('marketing-sales')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
export class MarketingSalesController {
  constructor(private readonly marketingSalesService: MarketingSalesService) {}

  @Post('listings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Create a new listing',
    description: 'Create a new product or service listing. For B2B listings, additional business verification may be required.'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The listing has been successfully created.'
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['Validation error details'],
        error: 'Bad Request'
      }
    }
  })
  @ApiForbiddenResponse({ 
    description: 'User does not have permission to create this type of listing',
  })
  @ApiBody({ 
    type: CreateListingDto,
    examples: {
      b2b: {
        summary: 'B2B Listing Example',
        value: {
          title: 'Bulk Office Chairs - Wholesale',
          description: 'Premium ergonomic office chairs available for wholesale purchase. MOQ: 50 units.',
          type: 'B2B',
          price: 199.99,
          category: 'Office Furniture',
          tags: ['office', 'chairs', 'ergonomic', 'bulk'],
          commissionRate: 5,
          isNegotiable: true,
          minOrder: 10,
          maxOrder: 1000,
          leadTime: '2-3 weeks'
        }
      },
      b2c: {
        summary: 'B2C Listing Example',
        value: {
          title: 'Single Office Chair - Retail',
          description: 'Comfortable office chair for home use',
          type: 'B2C',
          price: 249.99,
          category: 'Home Office',
          tags: ['home', 'office', 'chair'],
          isNegotiable: false
        }
      }
    }
  })
  async createListing(@Request() req, @Body() createListingDto: CreateListingDto): Promise<Listing> {
    return this.marketingSalesService.createListing(req.user.userId, createListingDto);
  }

  @Get('listings')
  @ApiOperation({ 
    summary: 'Get all listings',
    description: 'Retrieve a list of all listings with optional filtering. Supports pagination and filtering by status, type, and category.'
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SOLD', 'DRAFT', 'EXPIRED'],
    description: 'Filter listings by status' 
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['B2B', 'B2C', 'C2C', 'B2G'],
    description: 'Filter listings by business type' 
  })
  @ApiQuery({ 
    name: 'category', 
    required: false, 
    description: 'Filter by category name' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number,
    description: 'Page number for pagination' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Number of items per page' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of listings retrieved successfully', 
    type: [Listing] 
  })
  async findAllListings(@Query('status') status?: string): Promise<Listing[]> {
    return this.marketingSalesService.findAllListings(status);
  }

  @Get('listings/search')
  @ApiOperation({ summary: 'Search listings' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['C2C', 'B2B', 'B2C'] })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiResponse({ status: 200, description: 'Return matching listings.', type: [Listing] })
  async searchListings(
    @Query('q') query: string,
    @Query('category') category: string,
    @Query('type') type: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ): Promise<Listing[]> {
    const filters = {
      ...(category && { category }),
      ...(type && { type }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    };
    return this.marketingSalesService.searchListings(query || '', filters);
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Get a listing by ID' })
  @ApiResponse({ status: 200, description: 'Return the listing.', type: Listing })
  @ApiResponse({ status: 404, description: 'Listing not found.' })
  async findOneListing(@Param('id', ParseUUIDPipe) id: string): Promise<Listing> {
    return this.marketingSalesService.findListingById(id);
  }

  @Put('listings/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing' })
  @ApiResponse({ status: 200, description: 'The listing has been successfully updated.', type: Listing })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Listing not found.' })
  async updateListing(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() updateListingDto: Partial<CreateListingDto>,
  ): Promise<Listing> {
    return this.marketingSalesService.updateListing(id, updateListingDto, req.user.userId, req.user.role === UserRole.ADMIN);
  }

  @Delete('listings/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a listing' })
  @ApiResponse({ status: 200, description: 'The listing has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Listing not found.' })
  async removeListing(@Param('id', ParseUUIDPipe) id: string, @Request() req): Promise<void> {
    return this.marketingSalesService.removeListing(id, req.user.userId, req.user.role === UserRole.ADMIN);
  }

  @Put('listings/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing status (Admin only)' })
  @ApiResponse({ status: 200, description: 'The listing status has been updated.', type: Listing })
  @ApiResponse({ status: 400, description: 'Invalid status.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Listing not found.' })
  async updateListingStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ListingStatus,
    @Request() req,
  ): Promise<Listing> {
    if (!['PENDING', 'APPROVED', 'REJECTED', 'SOLD'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.marketingSalesService.updateListingStatus(id, status as ListingStatus, req.user.userId);
  }
}
