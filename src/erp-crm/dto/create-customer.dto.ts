import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Company name', example: 'Acme Inc.' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ description: 'Contact person name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ description: 'Email address', example: 'contact@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Billing address', required: false })
  @IsString()
  @IsOptional()
  billingAddress?: string;

  @ApiProperty({ description: 'Shipping address', required: false })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({ description: 'Tax ID or VAT number', required: false })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({ description: 'Payment terms in days', example: 30, required: false })
  @IsOptional()
  paymentTerms?: number;
}
