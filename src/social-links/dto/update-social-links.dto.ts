import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSocialLinksDto } from './create-social-links.dto';

export class UpdateSocialLinksDto extends PartialType(CreateSocialLinksDto) {
  @ApiPropertyOptional({
    description: 'Facebook profile URL',
    example: 'https://facebook.com/username',
    type: String
  })
  facebookUrl?: string;

  @ApiPropertyOptional({
    description: 'Instagram profile URL',
    example: 'https://instagram.com/username',
    type: String
  })
  instagramUrl?: string;

  @ApiPropertyOptional({
    description: 'TikTok profile URL',
    example: 'https://tiktok.com/@username',
    type: String
  })
  tiktokUrl?: string;

  @ApiPropertyOptional({
    description: 'YouTube channel URL',
    example: 'https://youtube.com/channel/UC...',
    type: String
  })
  youtubeUrl?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/username',
    type: String
  })
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'Twitter/X profile URL',
    example: 'https://twitter.com/username',
    type: String
  })
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: 'Telegram profile URL',
    example: 'https://t.me/username',
    type: String
  })
  telegramUrl?: string;

  @ApiPropertyOptional({
    description: 'WhatsApp phone number for click-to-chat',
    example: '+1234567890',
    type: String
  })
  whatsappNumber?: string;

  @ApiPropertyOptional({
    description: 'Personal or business website URL',
    example: 'https://example.com',
    type: String
  })
  websiteUrl?: string;
}
