import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from './entities/bot.entity';
import { UsersModule } from '../users/users.module';
import { encryptionService } from '../../utils/encryption';
import { DeploymentsModule } from '../deployments/deployments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bot]),UsersModule,DeploymentsModule],
  controllers: [BotController],
  providers: [BotService,encryptionService],
  exports: [BotService],
})
export class BotModule {}
