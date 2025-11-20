import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The content of the post',
    example: 'This is a sample post content',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    description: 'Array of media URLs (images/videos)',
    example: ['https://example.com/image1.jpg'],
    required: false,
    type: [String]
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  media?: string[];

  @ApiProperty({
    description: 'ID of the post author (defaults to current user if not provided)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  authorId?: string;
}