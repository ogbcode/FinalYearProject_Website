import { Controller, Get, Post, Body, Patch, Param, Delete, Version, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Customer } from './entities/customer.entity';

@Controller('customers')
@ApiTags('Customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Version('1')
  @Post("create")
  @ApiOperation({ summary: 'Create a new Customer' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Customer successfully created' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customersService.create(createCustomerDto);
      return customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  @Version('1')
  @Get("user/:id")
  @ApiOperation({ summary: 'Get all customers linked to a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all customers linked to a user',
    type: Customer,
    isArray: true,
  })
  async findAll(@Param('id') id: string) {
    try {
      const customers = await this.customersService.findAll(id);
      return customers;
    } catch (error) {
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
  }
  
  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer found by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async findOne(@Param('id') id: string) {
    try {
      const customer = await this.customersService.findOne(id);
      return customer;
    } catch (error) {
      throw new Error(`Failed to find customer: ${error.message}`);
    }
  }

  @Version('1')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    try {
      const updatedCustomer = await this.customersService.update(id, updateCustomerDto);
      return updatedCustomer;
    } catch (error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }
  @Version('1')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @HttpCode(HttpStatus.OK) // Explicitly setting HTTP status code to 200
  async remove(@Param('id') id: string) {
    try {
      return await this.customersService.remove(id);

    } catch (error) {
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  }
}
