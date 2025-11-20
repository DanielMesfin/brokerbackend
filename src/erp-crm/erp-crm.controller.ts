import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ErpCrmService } from './erp-crm.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';

@ApiTags('erp-crm')
@Controller('erp-crm')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ErpCrmController {
  constructor(private readonly erpCrmService: ErpCrmService) {}

  @Post('customers')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer successfully created.', type: Customer })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.erpCrmService.createCustomer(createCustomerDto);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers.', type: [Customer] })
  async findAllCustomers(): Promise<Customer[]> {
    return this.erpCrmService.findAllCustomers();
  }

  @Get('customers/:id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, description: 'Return the customer.', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  async findCustomerById(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    return this.erpCrmService.findCustomerById(id);
  }

  @Put('customers/:id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully updated.', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  async updateCustomer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateCustomerDto>,
  ): Promise<Customer> {
    return this.erpCrmService.updateCustomer(id, updateData);
  }

  @Delete('customers/:id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  async deleteCustomer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.erpCrmService.deleteCustomer(id);
  }
}
