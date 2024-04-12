import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Bot } from 'src/modules/bot/entities/bot.entity';

export class CreateDeploymentDto {
 

  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsNotEmpty({ message: 'botId is required' })
  @IsString()
  botId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'userId is required' })
  @IsString()
  userId: string;

  @ApiProperty()
  environmentId: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  serviceId: string;
  
  @ApiProperty()
  domain: string;

}
