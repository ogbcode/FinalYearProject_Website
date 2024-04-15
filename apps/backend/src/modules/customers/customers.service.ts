import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BotService } from '../bot/bot.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly UserService: UsersService,
    private readonly botService: BotService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
  const customer = await this.customerRepository.findOne({
    where: { telegramId: createCustomerDto.telegramId, bot: { id:createCustomerDto.botId} }
  });
  if (customer) {
      throw new Error("Customer already exists");
    }

    const user= await this.UserService.findOneById(
      createCustomerDto.userId
    )
    const bot= await this.botService.findOne(
      createCustomerDto.botId
    )
    if (!user) {
      throw new Error(
        `Program with id ${createCustomerDto.userId} does not exist`,
      );
    }
    const customerProps = {
      ...createCustomerDto,
      user:user,
      bot:bot,
    };
    const new_Customer=await this.customerRepository.create(customerProps);
    return await this.customerRepository.save(new_Customer);
  }

  async findAll(userId:string): Promise<any> {
    const customer= await this.customerRepository.find({where:{user:{id:userId}},relations: ['bot']});
    if(!customer){
      throw new Error("No Customers found")
    }
    const modifiedCustomers = customer.map(customer => ({
      id: customer.id,
      firstName: customer.firstName,
      telegramId: customer.telegramId,
      createdAt:customer.createdAt,
      updatedAt: customer.updatedAt,
      botName: customer.bot ? customer.bot.name : null, // Assuming botId can be null if bot is not present
    }));
  
    return modifiedCustomers;
  }

  async findAllForBroadcast(botId:string):Promise<any>{
    const customer= await this.customerRepository.find({where:{bot:{ id: botId}}});
    if(!customer){
      throw new Error("No Customers found")
    }
    const query =await this.customerRepository
    .createQueryBuilder("customer")
    .select("customer.telegramId")
    .where("customer.botId = :botId", { botId:botId})
    .getRawMany();
  
  return query
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

  async findOneByTelegramId(telegramId: string,botId): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { telegramId:telegramId,bot:{ id: botId}},
    });
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
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
