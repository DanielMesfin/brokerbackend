import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

type PrismaCustomer = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  billingAddress: string | null;
  shippingAddress: string | null;
  taxId: string | null;
  paymentTerms: number | null;
  createdAt: Date;
  updatedAt: Date;
};

function mapPrismaCustomerToCustomer(prismaCustomer: PrismaCustomer): Customer {
  return {
    ...prismaCustomer,
    phone: prismaCustomer.phone ?? undefined,
    billingAddress: prismaCustomer.billingAddress ?? undefined,
    shippingAddress: prismaCustomer.shippingAddress ?? undefined,
    taxId: prismaCustomer.taxId ?? undefined,
    paymentTerms: prismaCustomer.paymentTerms ?? undefined,
  };
}

@Injectable()
export class ErpCrmService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        phone: createCustomerDto.phone ?? null,
        billingAddress: createCustomerDto.billingAddress ?? null,
        shippingAddress: createCustomerDto.shippingAddress ?? null,
        taxId: createCustomerDto.taxId ?? null,
        paymentTerms: createCustomerDto.paymentTerms ?? null,
      },
    });
    return mapPrismaCustomerToCustomer(customer);
  }

  async findAllCustomers(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany({
      orderBy: {
        companyName: 'asc',
      },
    });
    return customers.map(mapPrismaCustomerToCustomer);
  }

  async findCustomerById(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return mapPrismaCustomerToCustomer(customer);
  }

  async updateCustomer(id: string, updateData: Partial<CreateCustomerDto>): Promise<Customer> {
    await this.findCustomerById(id); // Check if customer exists
    
    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        ...updateData,
        phone: updateData.phone ?? null,
        billingAddress: updateData.billingAddress ?? null,
        shippingAddress: updateData.shippingAddress ?? null,
        taxId: updateData.taxId ?? null,
        paymentTerms: updateData.paymentTerms ?? null,
      },
    });
    return mapPrismaCustomerToCustomer(customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.findCustomerById(id); // Check if customer exists
    
    await this.prisma.customer.delete({
      where: { id },
    });
  }
}
