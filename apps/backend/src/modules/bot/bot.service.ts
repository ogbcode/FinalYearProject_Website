import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bot } from './entities/bot.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { error } from 'console';
import { User } from '../users/entities/user.entity';
import { encryptionService } from 'src/utils/encryption';
import * as crypto from 'crypto';
import { FastifyLoader } from '@nestjs/serve-static';
import { DeploymentsService } from '../deployments/deployments.service';
import { hash } from 'bcrypt';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
    private readonly userService: UsersService,
    private readonly encryptionService: encryptionService,
    private readonly deploymentService: DeploymentsService,

  ) {}
  async createHash(botId: string): Promise<string> {
    const token='ChidubemRailway234'
    const combinedString =botId+token;; // Combine userId and botId
    const hash = crypto.createHash('sha256');
    hash.update(combinedString);
    return hash.digest('hex');
  }
  
  async generateRandomString(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }

  async create(createBotDto: CreateBotDto) {
    // Check if a bot already exists for the given group chat ID
    const existingBot = await this.botRepository.findOneBy({
      groupchatId: createBotDto.groupchatId,
    });


    if (existingBot) {
      throw new Error('A Bot already exists for this group');
    }

    // Find the user by ID
    const user = await this.userService.findOneById(createBotDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    createBotDto.binance.binance_publickey=await this.encryptionService.binancePublicKey(createBotDto.binance.binance_apikey,createBotDto.binance.binance_secretkey)
    const botProps: Partial<Bot> = {
      ...createBotDto,
      binance: await this.encryptionService.encryptData(JSON.stringify(createBotDto.binance)),
      coinpayment: await this.encryptionService.encryptData(JSON.stringify(createBotDto.coinpayment)),
      nowpayment: await this.encryptionService.encryptData(JSON.stringify(createBotDto.nowpayment)),
      paystack: await this.encryptionService.encryptData(JSON.stringify(createBotDto.paystack)),
      telegram: await this.encryptionService.encryptData(JSON.stringify(createBotDto.telegram)),
      crypto_address: await this.encryptionService.encryptData(JSON.stringify(createBotDto.crypto_address)),
      user: user,
  };
  
  
    // Create and save the new bot entity within a single transaction
    try{
      const newBot= await this.botRepository.save(this.botRepository.create(botProps));
      const deploydetails={
      name:"Bot"+(await this.generateRandomString()),
      botId: newBot.id,
      userId:newBot.user.id,
      environmentId:null,
      projectId:null,
      serviceId:null,
      domain: null,
    }
     
    const botx=await this.findOne(newBot.id)
    const deployedbot=await this.deploymentService.create(deploydetails,botx)
    newBot.deployment = deployedbot;
    await this.botRepository.save(newBot);

    return{"deployment succesfull":deployedbot}
  }
  catch(error){
    console.error('Error creating bot:', error);
    throw new Error('Failed to create bot');
  }
  }

  async findAll(userId: string): Promise<Bot[]> {
    const bots = await this.botRepository.find({
      where: { user: { id: userId } },
    });
    if (!bots || bots.length === 0) {
      throw new NotFoundException('No bots found for the user');
    }
    return bots;
  }

  async findOne(id: string): Promise<Bot> {
    const bot = await this.botRepository.findOne({ where: { id } ,relations:["deployment"]});
    if (!bot) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
    return bot;
  }
  async sendData(id,token){
    const bot=await this.findOne(id)
    if (!bot){
      throw new NotFoundException("Bot Not found")
    }

    if (token !== await this.createHash(id)) {
      throw new UnauthorizedException("Invalid token");
    }
    
    const botDomain=await this.deploymentService.findOne(bot.deployment.id)
    const decrypteData={...bot,      
      binance: JSON.parse(await this.encryptionService.decryptData(bot.binance)),
      telegram: JSON.parse(await this.encryptionService.decryptData(bot.telegram)),
      coinpayment: JSON.parse(await this.encryptionService.decryptData(bot.coinpayment)),
      nowpayment: JSON.parse(await this.encryptionService.decryptData(bot.nowpayment)),
      paystack: JSON.parse(await this.encryptionService.decryptData(bot.paystack)),
      crypto_address: JSON.parse(await this.encryptionService.decryptData(bot.crypto_address)),
      domain:botDomain.domain
    }
    const encryptedBotData=await this.encryptionService.encryptData(JSON.stringify(decrypteData),process.env.BOT_ENCRYPTION_KEY)
    return {"data":encryptedBotData}
  }
  async update(id: string, updateBotDto: UpdateBotDto): Promise<Bot> {
    const bot = await this.findOne(id);
    if (!bot) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
    const updatedValues: { [key: string]: string } = {};

    const fieldsToHandle = ['telegram','crypto_address','binance', 'nowpayment', 'coinpayment', 'paystack'];

    for (const field of fieldsToHandle) {
      if (updateBotDto[field]) {
        let decryptedData = '';
        if (bot[field]) {
          decryptedData = await this.encryptionService.decryptData(bot[field]);
        }
        let decryptedBotObject = {};
        if (decryptedData) {
          decryptedBotObject = JSON.parse(decryptedData);
        }
        const updatedBot = { ...decryptedBotObject, ...updateBotDto[field] };
        const encryptedUpdatedbot = await this.encryptionService.encryptData(
          JSON.stringify(updatedBot),
        );
        updatedValues[field] = encryptedUpdatedbot;
      }
    }

    const updatedBot = Object.assign({}, bot, updateBotDto, updatedValues);
    return await this.botRepository.save(updatedBot);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const deployment=await this.findOne(id)
    await this.deploymentService.deleteService(deployment.deployment.serviceId)
    const result = await this.botRepository.delete(id);
    if (result.affected>0) {
      return { success: true, message:"delete succesfull"};
    } else {
      return { success: false, message: 'Failed to delete bot.' };
    }
  
}

}
