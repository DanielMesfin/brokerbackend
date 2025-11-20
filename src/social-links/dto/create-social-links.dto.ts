import { IsOptional, IsUrl, IsString, IsPhoneNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSocialLinksDto {
  @ApiPropertyOptional({
    description: 'Facebook profile URL',
    example: 'https://facebook.com/username',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'Facebook URL must be a valid URL' })
  facebookUrl?: string;

  @ApiPropertyOptional({
    description: 'Instagram profile URL',
    example: 'https://instagram.com/username',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'Instagram URL must be a valid URL' })
  instagramUrl?: string;

  @ApiPropertyOptional({
    description: 'TikTok profile URL',
    example: 'https://tiktok.com/@username',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'TikTok URL must be a valid URL' })
  tiktokUrl?: string;

  @ApiPropertyOptional({
    description: 'YouTube channel URL',
    example: 'https://youtube.com/channel/UC...',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'YouTube URL must be a valid URL' })
  youtubeUrl?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/username',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn URL must be a valid URL' })
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'Twitter/X profile URL',
    example: 'https://twitter.com/username',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'Twitter URL must be a valid URL' })
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: 'Telegram profile URL',
    example: 'https://t.me/username',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'Telegram URL must be a valid URL' })
  telegramUrl?: string;

  @ApiPropertyOptional({
    description: 'WhatsApp phone number for click-to-chat',
    example: '+1234567890',
    type: String
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber(undefined, { message: 'Invalid WhatsApp number' })
  whatsappNumber?: string;

  @ApiPropertyOptional({
    description: 'Personal or business website URL',
    example: 'https://example.com',
    type: String
  })
  @IsOptional()
  @IsUrl({}, { message: 'Website URL must be a valid URL' })
  websiteUrl?: string;
}
