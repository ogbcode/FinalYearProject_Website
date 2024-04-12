import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';

@Controller('transaction')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Version('1')
  @Post("create")
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Transaction successfully created' })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      const transaction = await this.transactionsService.create(createTransactionDto);
      return transaction;
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  @Version('1')
  @Get("customer/:id")
  @ApiOperation({ summary: 'Get all transactions for a customer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all transactionsm for a customer',
    type: Transaction,
    isArray: true,
  })
  async findAll(@Param('id') id: string) {
    try {
      const transactions = await this.transactionsService.findAll(id);
      return transactions;
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction found by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  async findOne(@Param('id') id: string) {
    try {
      const transaction = await this.transactionsService.findOne(id);
      return transaction;
    } catch (error) {
      throw new Error(`Failed to find transaction: ${error.message}`);
    }
  }
  @Version('1')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    try {
      const updatedTransaction = await this.transactionsService.update(id, updateTransactionDto);
      return updatedTransaction;
    } catch (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  @Version('1')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  @HttpCode(HttpStatus.OK) // Explicitly setting HTTP status code to 200
  async remove(@Param('id') id: string) {
    try {
      return await this.transactionsService.remove(id);
 
    } catch (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }
}
