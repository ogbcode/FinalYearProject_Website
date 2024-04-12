import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly UserService: UsersService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
  const customer = await this.customerRepository.findOne({
    where: { telegramId: createCustomerDto.telegramId, user: { id:createCustomerDto.userId} }
  });
  if (customer) {
      throw new Error("Customer already exists");
    }

    const user= await this.UserService.findOneById(
      createCustomerDto.userId
    )

    if (!user) {
      throw new Error(
        `Program with id ${createCustomerDto.userId} does not exist`,
      );
    }
    const customerProps = {
      ...createCustomerDto,
      user:user,
    };
    const new_Customer=await this.customerRepository.create(customerProps);
    return await this.customerRepository.save(new_Customer);
  }

  async findAll(userId:string): Promise<Customer[]> {
    const customer= await this.customerRepository.find({where:{user:{id:userId}}});
    if(!customer){
      throw new Error("No Customers found")
    }
    return customer
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const updatedCustomer = Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(updatedCustomer);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.customerRepository.delete(id);
    if (result.affected > 0) {
        return { success: true, message: 'Customer deleted successfully.' };
    } else {
        return { success: false, message: 'Failed to delete customer.' };
    }
}


}
