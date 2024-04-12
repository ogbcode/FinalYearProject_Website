import { Module, forwardRef } from '@nestjs/common';
import { DeploymentsService } from './deployments.service';
import { DeploymentsController } from './deployments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';
import { BotModule } from '../bot/bot.module';
import { BotService } from '../bot/bot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment])],
  controllers: [DeploymentsController],
  providers: [DeploymentsService],
  exports: [DeploymentsService], 
})
export class DeploymentsModule {}
