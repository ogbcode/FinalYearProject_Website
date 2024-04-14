import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsUUID } from 'class-validator';

export class CreateTransactionDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  amount:string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  platform: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  telegramId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  botId: string;
}

