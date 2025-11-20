import { ApiProperty } from '@nestjs/swagger';

export class Customer {
  @ApiProperty({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Company name', example: 'Acme Inc.' })
  companyName: string;

  @ApiProperty({ description: 'Contact person name', example: 'John Doe' })
  contactPerson: string;

  @ApiProperty({ description: 'Email address', example: 'contact@acme.com' })
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
  phone?: string;

  @ApiProperty({ description: 'Billing address', required: false })
  billingAddress?: string;

  @ApiProperty({ description: 'Shipping address', required: false })
  shippingAddress?: string;

  @ApiProperty({ description: 'Tax ID or VAT number', required: false })
  taxId?: string;

  @ApiProperty({ description: 'Payment terms in days', example: 30, required: false })
  paymentTerms?: number;

  @ApiProperty({ description: 'Date when the customer was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the customer was last updated' })
  updatedAt: Date;
}
