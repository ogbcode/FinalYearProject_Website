import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsUUID } from 'class-validator';

export class CreateTransactionDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

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
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerId: string;
}

