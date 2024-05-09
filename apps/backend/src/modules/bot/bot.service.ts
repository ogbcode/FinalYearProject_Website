import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import Stripe from 'stripe';

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
    const token = 'ChidubemRailway234';
    const combinedString = botId + token; // Combine userId and botId
    const hash = crypto.createHash('sha256');
    hash.update(combinedString);
    return hash.digest('hex');
  }

  async generateRandomString(): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  async set_webhook(url: string, apiKey: string): Promise<any | undefined> {
    try {
      const stripe = new Stripe(apiKey);

      const webhook = await stripe.webhookEndpoints.create({
        enabled_events: ['checkout.session.completed', 'charge.failed'],
        url: url,
      });

      return {"webhook_secret":webhook.secret,"id":webhook.id};
    } catch (e) {
      // console.error('Error creating webhook endpoint:', e);
      return undefined; // You can modify this return value based on your error handling strategy
    }
  }
  async deleteStripeWebhook(apiKey,webhookId){
    try{
    const stripe = new Stripe(apiKey);
    await stripe.webhookEndpoints.del(webhookId)
    return true
    }
    catch(e){
      return false
    }
  }

  async create(createBotDto: CreateBotDto) {
    // Check if a bot already exists for the given group chat ID
    // console.log(createBotDto)
    // const existingBot = await this.botRepository.findOneBy({
    //   groupchatId: createBotDto.groupchatId,
    // });

    // if (existingBot) {
    //   throw new Error('A Bot already exists for this group');
    // }

    // Find the user by ID
    const user = await this.userService.findOneById(createBotDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (createBotDto.binance) {
      createBotDto.binance.binance_publickey =
        await this.encryptionService.binancePublicKey(
          createBotDto.binance.binance_apikey,
          createBotDto.binance.binance_secretkey,
        );
    }

    const botProps: Partial<Bot> = {
      ...createBotDto,
      binance: createBotDto.binance
        ? await this.encryptionService.encryptData(
            JSON.stringify(createBotDto.binance),
          )
        : null,
      coinpayment: createBotDto.coinpayment
        ? await this.encryptionService.encryptData(
            JSON.stringify(createBotDto.coinpayment),
          )
        : null,
      nowpayment: createBotDto.nowpayment
        ? await this.encryptionService.encryptData(
            JSON.stringify(createBotDto.nowpayment),
          )
        : null,
      stripe: createBotDto.stripe
        ? await this.encryptionService.encryptData(
            JSON.stringify(createBotDto.stripe),
          )
        : null,
      paystack: createBotDto.paystack
        ? await this.encryptionService.encryptData(
            JSON.stringify(createBotDto.paystack),
          )
        : null,
      telegram: await this.encryptionService.encryptData(
        JSON.stringify(createBotDto.telegram),
      ),
      crypto_address: createBotDto.crypto_address
        ? await this.encryptionService.encryptData(
            JSON.stringify(createBotDto.crypto_address),
          )
        : null,
      user: user,
    };

    // Create and save the new bot entity within a single transaction
    try {
      const newBot = await this.botRepository.save(
        this.botRepository.create(botProps),
      );
      const deploydetails = {
        name: 'Bot' + (await this.generateRandomString()),
        botId: newBot.id,
        userId: newBot.user.id,
        environmentId: null,
        projectId: null,
        serviceId: null,
        domain: null,
      };

      const botx = await this.findOne(newBot.id);
      const deployedbot = await this.deploymentService.create(
        deploydetails,
        botx,
      );
      newBot.deployment = deployedbot;
      const botDomain = deployedbot.domain;
      
      const setwebhook = createBotDto.stripe
        ? await this.set_webhook(
            botDomain + '/stripe',
            createBotDto.stripe.stripe_apikey,
          )
        : '';
      const webhooksecret=setwebhook?.webhook_secret
      const webhookId=setwebhook?.id
      const stripeUpdate = createBotDto.stripe?.stripe_apikey
        ? {
            stripe: {
              stripe_apikey: createBotDto.stripe.stripe_apikey,
              stripe_secret: webhooksecret,
              stripe_webhookid:webhookId
            },
          }
        : null;
      await this.botRepository.save(newBot);
      await this.update(newBot.id, stripeUpdate);
      // return { 'deployment succesfull': deployedbot };
      return { message: 'deployment succesfull' };
    } catch (error) {
      console.error('Error creating bot:', error);
      throw new Error('Failed to create bot');
    }
  }

  async findAll(userId: string): Promise<Bot[]> {
    const bots = await this.botRepository.find({
      where: { user: { id: userId } },
      relations: ['deployment'],
    });
    if (!bots || bots.length === 0) {
      throw new NotFoundException('No bots found for the user');
    }

    return bots;
  }

  async botCount(userId: string): Promise<any> {
    try {
      const botCount = await this.botRepository.count({
        where: { user: { id: userId } },
      });
      return botCount;
    } catch (error) {
      return error;
    }
  }
  async findOne(id: string): Promise<Bot> {
    const bot = await this.botRepository.findOne({
      where: { id },
      relations: ['deployment'],
    });
    if (!bot) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
    return bot;
  }
  async sendData(id, token) {
    const bot = await this.findOne(id);
    if (!bot) {
      throw new NotFoundException('Bot Not found');
    }

    if (token !== (await this.createHash(id))) {
      throw new UnauthorizedException('Invalid token');
    }

    const botDomain = await this.deploymentService.findOne(bot.deployment.id);
    const decrypteData = {
      ...bot,
      binance: JSON.parse(
        await this.encryptionService.decryptData(bot.binance),
      ),
      stripe: JSON.parse(await this.encryptionService.decryptData(bot.stripe)),
      telegram: JSON.parse(
        await this.encryptionService.decryptData(bot.telegram),
      ),
      coinpayment: JSON.parse(
        await this.encryptionService.decryptData(bot.coinpayment),
      ),
      nowpayment: JSON.parse(
        await this.encryptionService.decryptData(bot.nowpayment),
      ),
      paystack: JSON.parse(
        await this.encryptionService.decryptData(bot.paystack),
      ),
      crypto_address: JSON.parse(
        await this.encryptionService.decryptData(bot.crypto_address),
      ),
      domain: botDomain.domain,
    };
    const encryptedBotData = await this.encryptionService.encryptData(
      JSON.stringify(decrypteData),
      process.env.BOT_ENCRYPTION_KEY,
    );
    return { data: encryptedBotData };
  }
  async update(id: string, updateBotDto: UpdateBotDto): Promise<Bot> {
    const bot = await this.findOne(id);
    if (!bot) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
    const updatedValues: { [key: string]: string } = {};

    const fieldsToHandle = [
      'telegram',
      'crypto_address',
      'binance',
      'nowpayment',
      'coinpayment',
      'paystack',
      'stripe',
    ];

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
    const deployment = await this.findOne(id);
    await this.deploymentService.deleteService(deployment.deployment.serviceId);
    const stripe=deployment.stripe
    const decryptedStripe=JSON.parse(await this.encryptionService.decryptData(stripe))
    const stripeApikey=decryptedStripe.stripe_apikey
    const stripeWebhook=decryptedStripe.stripe_webhookid
    await this.deleteStripeWebhook(stripeApikey,stripeWebhook)
    const result = await this.botRepository.delete(id);
    if (result.affected > 0) {
      return { success: true, message: 'delete succesfull' };
    } else {
      return { success: false, message: 'Failed to delete bot.' };
    }
  }
}
