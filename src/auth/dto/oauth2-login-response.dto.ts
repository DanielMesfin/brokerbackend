import { ApiProperty } from '@nestjs/swagger';

export class OAuth2LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      email: { type: 'string', example: 'user@example.com' },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg' },
      isEmailVerified: { type: 'boolean', example: true },
      role: { 
        type: 'string', 
        enum: ['USER', 'ADMIN', 'MODERATOR', 'PREMIUM', 'BUSINESS_OWNER', 'INFLUENCER'],
        example: 'USER' 
      },
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    role: string;
  };

  @ApiProperty({
    description: 'Expiration time of the access token in seconds',
    example: 3600,
  })
  expiresIn: number;
}
