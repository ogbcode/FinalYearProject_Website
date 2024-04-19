import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto): Promise<Subscriber> {
    const newSubscriber = this.subscriberRepository.create(createSubscriberDto);
    return await this.subscriberRepository.save(newSubscriber);
  }

  async findAll(userId:string): Promise<any> {
    const subscribers=await this.subscriberRepository.find({where:{bot:{user:{id:userId}}},relations:['bot']});
    const modifiedSubscriber = subscribers.map(subscribers => ({
      id: subscribers.id,
      firstName: subscribers.firstName,
      telegramId: subscribers.telegramId,
      joinDate:subscribers.joinDate,
      expiryDate:subscribers.expiryDate,
      active:subscribers.active,
      duration:subscribers.duration,
      createdAt:subscribers.createdAt,
      updatedAt: subscribers.updatedAt,
      botName: subscribers.bot ? subscribers.bot.name : null, // Assuming botId can be null if bot is not present
    }));
    return modifiedSubscriber
  
  }
  async findOne(id: string): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({where:{id:id}});
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
    return subscriber;
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto): Promise<Subscriber> {
    const subscriber = await this.findOne(id);
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }

    const updatedSubscriber = Object.assign(subscriber, updateSubscriberDto);
    return await this.subscriberRepository.save(updatedSubscriber);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.subscriberRepository.delete(id);
    if (result.affected > 0) {
        return { success: true, message: 'Subscriber deleted successfully.' };
    } else {
        return { success: false, message: 'Failed to delete subscriber.' };
    }
  }
}
