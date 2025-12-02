import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Request as NestRequest,
  BadRequestException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { BusinessService } from './business.service';
import { 
  CreateBusinessDto, 
  UpdateBusinessDto, 
  BusinessQueryDto, 
  BusinessResponseDto,
  DocumentUploadResponseDto,
  BusinessStatsResponseDto,
  ComplianceRequirementUpdateDto,
} from './dto/business.dto';
import { DocumentType } from './entities/business-document.entity';
import { Business, BusinessStatus, BusinessType } from './entities/business.entity';
import { VerificationStatus } from './entities/business-verification.entity';
import { ComplianceStatus } from './entities/business-compliance.entity';

interface RequestWithUser extends ExpressRequest {
  user: {
    id: string;
  };
}

@ApiTags('Businesses')
@Controller('businesses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new business' })
  @ApiResponse({ status: 201, description: 'Business registered successfully', type: BusinessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Body() createBusinessDto: CreateBusinessDto, 
    @NestRequest() req: RequestWithUser
  ): Promise<BusinessResponseDto> {
    return this.businessService.create(createBusinessDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of businesses', type: [BusinessResponseDto] })
  async findAll(@Query() query: BusinessQueryDto): Promise<{ data: BusinessResponseDto[]; total: number }> {
    return this.businessService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get business statistics' })
  @ApiResponse({ status: 200, description: 'Business statistics', type: BusinessStatsResponseDto })
  async getStats(): Promise<BusinessStatsResponseDto> {
    return this.businessService.getBusinessStats();
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all business types' })
  @ApiResponse({ status: 200, description: 'List of business types' })
  getBusinessTypes(): { value: string; label: string }[] {
    return Object.entries(BusinessType).map(([key, value]) => ({
      value,
      label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    }));
  }

  @Get('statuses')
  @ApiOperation({ summary: 'Get all business statuses' })
  @ApiResponse({ status: 200, description: 'List of business statuses' })
  getBusinessStatuses(): { value: string; label: string }[] {
    return Object.entries(BusinessStatus).map(([key, value]) => ({
      value,
      label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    }));
  }

  @Get('verification-statuses')
  @ApiOperation({ summary: 'Get all verification statuses' })
  @ApiResponse({ status: 200, description: 'List of verification statuses' })
  getVerificationStatuses(): { value: string; label: string }[] {
    return Object.entries(VerificationStatus).map(([key, value]) => ({
      value,
      label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    }));
  }

  @Get('compliance-statuses')
  @ApiOperation({ summary: 'Get all compliance statuses' })
  @ApiResponse({ status: 200, description: 'List of compliance statuses' })
  getComplianceStatuses(): { value: string; label: string }[] {
    return Object.entries(ComplianceStatus)
      .filter(([key]) => key !== 'COMPLIANCE_STATUS')
      .map(([key, value]) => ({
        value: value as string,
        label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
      }));
  }

  @Get('document-types')
  @ApiOperation({ summary: 'Get all document types' })
  @ApiResponse({ status: 200, description: 'List of document types' })
  getDocumentTypes(): { value: string; label: string }[] {
    return Object.entries(DocumentType).map(([key, value]) => ({
      value,
      label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business by ID' })
  @ApiResponse({ status: 200, description: 'Business details', type: BusinessResponseDto })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async findOne(@Param('id') id: string): Promise<BusinessResponseDto> {
    return this.businessService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({ status: 200, description: 'Business updated successfully', type: BusinessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @NestRequest() req: RequestWithUser,
  ): Promise<BusinessResponseDto> {
    return this.businessService.update(id, updateBusinessDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business' })
  @ApiResponse({ status: 200, description: 'Business deleted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async remove(
    @Param('id') id: string, 
    @NestRequest() req: RequestWithUser
  ): Promise<void> {
    return this.businessService.remove(id, req.user.id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Upload a document for a business' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: Object.values(DocumentType),
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
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Document uploaded successfully', type: DocumentUploadResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file or input' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(pdf|doc|docx|jpg|jpeg|png)' }),
        ],
      }),
    ) file: Express.Multer.File,
    @Body('type') type: DocumentType,
    @Body('issueDate') issueDate?: string,
    @Body('expiryDate') expiryDate?: string,
    @NestRequest() req: RequestWithUser,
  ): Promise<DocumentUploadResponseDto> {
    if (!Object.values(DocumentType).includes(type)) {
      throw new BadRequestException('Invalid document type');
    }

    const metadata: Record<string, any> = {};
    if (issueDate) metadata.issueDate = new Date(issueDate);
    if (expiryDate) metadata.expiryDate = new Date(expiryDate);

    return this.businessService.addDocument(
      id,
      file,
      type,
      req.user.id,
      metadata,
    );
  }

  @Post('documents/:documentId/verify')
  @ApiOperation({ summary: 'Verify a business document' })
  @ApiResponse({ status: 200, description: 'Document verification status updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body('status') status: 'approve' | 'reject',
    @Body('reason') reason?: string,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.businessService.verifyDocument(documentId, req.user.id, status, reason);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify a business' })
  @ApiResponse({ status: 200, description: 'Business verification status updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async verifyBusiness(
    @Param('id') id: string,
    @Body('status') status: 'approve' | 'reject',
    @Body('reason') reason?: string,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.businessService.verifyBusiness(id, req.user.id, status, reason);
  }

  @Get(':id/compliance')
  @ApiOperation({ summary: 'Get business compliance status' })
  @ApiResponse({ status: 200, description: 'Compliance status' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getComplianceStatus(@Param('id') id: string) {
    const business = await this.businessService.findOne(id);
    return business.compliance;
  }

  @Post(':id/compliance/requirements')
  @ApiOperation({ summary: 'Add a compliance requirement' })
  @ApiResponse({ status: 201, description: 'Compliance requirement added' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async addComplianceRequirement(
    @Param('id') id: string,
    @Body() requirement: ComplianceRequirementUpdateDto,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.businessService.addComplianceRequirement(id, requirement, req.user.id);
  }

  @Get('upcoming-renewals')
  @ApiOperation({ summary: 'Get upcoming document renewals' })
  @ApiResponse({ status: 200, description: 'List of upcoming renewals' })
  async getUpcomingRenewals(@Query('days') days: string = '30') {
    return this.businessService.getUpcomingRenewals(parseInt(days, 10));
  }

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  async getDashboardStats() {
    const stats = await this.businessService.getBusinessStats();
    const upcomingRenewals = await this.businessService.getUpcomingRenewals(30);

    return {
      ...stats,
      upcomingRenewals: upcomingRenewals.length,
    };
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend a business' })
  @ApiResponse({ status: 200, description: 'Business suspended' })
  @ApiResponse({ status: 400, description: 'Business already suspended' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async suspendBusiness(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @NestRequest() req: RequestWithUser,
  ) {
    const business = await this.businessService.findOne(id);
    if (business.status === BusinessStatus.SUSPENDED) {
      throw new BadRequestException('Business is already suspended');
    }

    return this.businessService.update(id, { 
      status: BusinessStatus.SUSPENDED,
      suspensionReason: reason,
      suspendedAt: new Date(),
    }, req.user.id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a suspended business' })
  @ApiResponse({ status: 200, description: 'Business activated' })
  @ApiResponse({ status: 400, description: 'Business is not suspended' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async activateBusiness(
    @Param('id') id: string,
    @NestRequest() req: RequestWithUser,
  ) {
    const business = await this.businessService.findOne(id);
    if (business.status !== BusinessStatus.SUSPENDED) {
      throw new BadRequestException('Business is not suspended');
    }

    return this.businessService.update(id, { 
      status: BusinessStatus.VERIFIED,
      suspensionReason: null,
      suspendedAt: null,
    }, req.user.id);
  }
}
