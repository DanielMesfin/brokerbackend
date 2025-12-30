import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards, 
  Query, 
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  Req,
  Request
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import { 
  CreatePromotionDto, 
  UpdatePromotionDto, 
  PromotionResponseDto 
} from './dto/promotion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

@ApiTags('Promotions')
@Controller('api/promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER as unknown as UserRole, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The promotion has been successfully created.',
    type: PromotionResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions' 
  })
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promotions' })
  @ApiQuery({ 
    name: 'category', 
    required: false, 
    enum: ['FOOD', 'FASHION', 'ELECTRONICS', 'BEAUTY', 'HOME', 'SPORTS', 'TRAVEL', 'OTHER'],
    description: 'Filter by promotion category' 
  })
  @ApiQuery({ 
    name: 'isActive', 
    required: false, 
    type: Boolean,
    description: 'Filter by active status' 
  })
  @ApiQuery({ 
    name: 'businessId', 
    required: false, 
    type: String,
    description: 'Filter by business ID' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns a list of promotions',
    type: [PromotionResponseDto]
  })
  async findAll(
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
    @Query('businessId') businessId?: string
  ) {
    return this.promotionService.findAll({ 
      category: category as any, 
      isActive,
      businessId
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the promotion with the specified ID',
    type: PromotionResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Promotion not found' 
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.promotionService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER as unknown as UserRole, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a promotion' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiBody({ type: UpdatePromotionDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The promotion has been successfully updated.',
    type: PromotionResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Promotion not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions' 
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePromotionDto: UpdatePromotionDto
  ) {
    return this.promotionService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER as unknown as UserRole, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a promotion' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'The promotion has been successfully deleted.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Promotion not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions' 
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.promotionService.remove(id);
  }

  @Post(':id/claim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Claim a promotion' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The promotion has been successfully claimed.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Promotion not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Promotion not available or already claimed' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  async claimPromotion(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: ExpressRequest & { user: { id: string } }
  ) {
    const userId = req.user.id;
    return this.promotionService.claimPromotion(id, userId);
  }
}
