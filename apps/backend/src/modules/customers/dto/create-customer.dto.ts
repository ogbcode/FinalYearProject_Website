import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Telegram ID is required' })
  @IsString()
  telegramId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'user ID is required' })
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'bot ID is required' })
  botId: string;
}
