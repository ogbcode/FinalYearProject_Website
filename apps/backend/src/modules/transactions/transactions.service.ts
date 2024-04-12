import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly Customerservice:CustomersService
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction=await this.transactionRepository.findOneBy({transactionId:createTransactionDto.transactionId})
    if (transaction) {
      throw new Error("transaction already exists");
    }

    const customer= await this.Customerservice.findOne(
      createTransactionDto.customerId
    )

    if (!customer) {
      throw new Error(
        `customer with id ${createTransactionDto.customerId} does not exist`,
      );
    }
    const transactionProps = {
      ...createTransactionDto,
      customer:customer,
    };
    const new_Transaction=await this.transactionRepository.create(transactionProps);
    return await this.transactionRepository.save(new_Transaction);

  }

  async findAll(customerId:string): Promise<Transaction[]> {
    return await this.transactionRepository.find({where:{customer:{id:customerId}}});
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({where:{id}});
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.Customerservice.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const updatedTransaction = Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(updatedTransaction);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.transactionRepository.delete(id);
    if (result.affected > 0) {
        return { success: true, message: 'Transaction deleted successfully.' };
    } else {
        return { success: false, message: 'Failed to delete transaction.' };
    }
}

}
