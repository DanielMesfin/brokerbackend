import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class ErpCrmService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
      },
    });
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      orderBy: {
        companyName: 'asc',
      },
    });
  }

  async findCustomerById(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async updateCustomer(id: string, updateData: Partial<CreateCustomerDto>): Promise<Customer> {
    await this.findCustomerById(id); // Check if customer exists
    
    return this.prisma.customer.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.findCustomerById(id); // Check if customer exists
    
    await this.prisma.customer.delete({
      where: { id },
    });
  }
}
