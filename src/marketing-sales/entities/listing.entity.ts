import { ApiProperty } from '@nestjs/swagger';

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD';

type User = {
  id: string;
  email: string;
  displayName: string | null;
  
};

export class Listing {
  @ApiProperty({ description: 'The unique identifier of the listing' })
  id: string;

  @ApiProperty({ description: 'The title of the listing' })
  title: string;

  @ApiProperty({ description: 'Detailed description of the listing' })
  description: string;

  @ApiProperty({ 
    enum: ['C2C', 'B2B', 'B2C'],
    description: 'The type of listing (C2C, B2B, or B2C)' 
  })
  type: string;

  @ApiProperty({ description: 'The price of the item' })
  price: number;

  @ApiProperty({ description: 'Category of the listing' })
  category: string;

  @ApiProperty({ 
    type: String,
    description: 'Comma-separated tags for the listing',
    example: 'electronics,gadgets,new'
  })
  tags: string;

  @ApiProperty({ 
    required: false,
    description: 'Commission rate for the listing (if applicable)',
    nullable: true
  })
  commissionRate: number | null;

  @ApiProperty({ 
    default: false,
    description: 'Whether the price is negotiable'
  })
  isNegotiable: boolean;

  @ApiProperty({ 
    required: false,
    description: 'Comma-separated URLs of listing images',
    nullable: true
  })
  imageUrls: string | null;

  @ApiProperty({ description: 'ID of the user who created the listing' })
  userId: string;

  @ApiProperty({ 
    default: true,
    description: 'Whether the listing is active'
  })
  isActive: boolean;

  @ApiProperty({ 
    default: 0,
    description: 'Number of views for the listing'
  })
  views: number;

  @ApiProperty({ 
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SOLD'],
    description: 'Current status of the listing'
  })
  status: string;

  @ApiProperty({ description: 'When the listing was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the listing was last updated' })
  updatedAt: Date;

  @ApiProperty({ type: Object, required: false })
  user?: User;

  constructor(partial: Partial<Listing>) {
    Object.assign(this, partial);
  }

  // Helper method to parse tags from JSON string
  getTags(): string[] {
    try {
      return this.tags ? JSON.parse(this.tags) : [];
    } catch (e) {
      return [];
    }
  }

  // Helper method to parse imageUrls from JSON string
  getImageUrls(): string[] {
    try {
      return this.imageUrls ? JSON.parse(this.imageUrls) : [];
    } catch (e) {
      return [];
    }
  }
}