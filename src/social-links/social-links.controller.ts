import { 
  Controller,
  Get,
  Post as HttpPost,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SocialLinksService } from './social-links.service';
import { CreateSocialLinksDto } from './dto/create-social-links.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import { JwtPrismaGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

class SocialLinksResponse {
  id: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  whatsappNumber?: string;
  websiteUrl?: string;
}

@ApiTags('Social Links')
@Controller('api/social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @HttpPost()
  @UseGuards(JwtPrismaGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create social links for the current user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Social links created', type: SocialLinksResponse })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Social links already exist for this user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User profile not found' })
  @ApiBody({ description: 'Social links payload', type: CreateSocialLinksDto })
  create(@CurrentUser() user: any, @Body() dto: CreateSocialLinksDto) {
    return this.socialLinksService.create(user.id, dto);
  }

  @Get('me')
  @UseGuards(JwtPrismaGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user social links' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns current user social links', type: SocialLinksResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User profile not found' })
  findMine(@CurrentUser() user: any) {
    return this.socialLinksService.findByUserId(user.id);
  }

  @Put('me')
  @UseGuards(JwtPrismaGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user social links' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Updated social links', type: SocialLinksResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User profile or social links not found' })
  @ApiBody({ description: 'Partial update payload', type: UpdateSocialLinksDto })
  updateMine(@CurrentUser() user: any, @Body() dto: UpdateSocialLinksDto) {
    return this.socialLinksService.findByUserIdAndUpdate(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get social links by ID' })
  @ApiParam({ name: 'id', description: 'Social links ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns social links', type: SocialLinksResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Social links not found' })
  findOne(@Param('id') id: string) {
    return this.socialLinksService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtPrismaGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update social links by ID' })
  @ApiParam({ name: 'id', description: 'Social links ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Updated social links', type: SocialLinksResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Social links not found' })
  @ApiBody({ description: 'Partial update payload', type: UpdateSocialLinksDto })
  update(@Param('id') id: string, @Body() dto: UpdateSocialLinksDto) {
    return this.socialLinksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtPrismaGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete social links by ID' })
  @ApiParam({ name: 'id', description: 'Social links ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Deletion success message' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Social links not found' })
  remove(@Param('id') id: string) {
    return this.socialLinksService.remove(id);
  }
}
