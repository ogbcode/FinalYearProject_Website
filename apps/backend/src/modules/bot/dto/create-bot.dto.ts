import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class BinanceDto {
  @ApiProperty({ description: 'Binance API Key' })
  @IsNotEmpty({ message: 'Binance API Key is required' })
  @IsString()
  binance_apikey: string;

  @ApiProperty({ description: 'Binance Secret Key' })
  @IsNotEmpty({ message: 'Binance Secret Key is required' })
  @IsString()
  binance_secretkey: string;

  @ApiProperty({ description: 'Binance Public Key' })
  // @IsNotEmpty({ message: 'Binance Public Key is required' })
  @IsString()
  binance_publickey?: string;
}

class CoinpaymentDto {
  @ApiProperty({ description: 'Coinpayment API Key' })
  @IsNotEmpty({ message: 'Coinpayment API Key is required' })
  @IsString()
  coinpayment_apikey: string;

  @ApiProperty({ description: 'Coinpayment Public Key' })
  @IsNotEmpty({ message: 'Coinpayment Public Key is required' })
  @IsString()
  coinpayment_publickey: string;

  @ApiProperty({ description: 'Coinpayment Merchant ID' })
  @IsNotEmpty({ message: 'Coinpayment Merchant ID is required' })
  @IsString()
  coinpayment_merchantId: string;

  @ApiProperty({ description: 'Coinpayment IPN Secret' })
  @IsNotEmpty({ message: 'Coinpayment IPN Secret is required' })
  @IsString()
  coinpayment_ipnsecret: string;
}

class NowpaymentsDto {
  @ApiProperty({ description: 'Nowpayments API Key' })
  @IsNotEmpty({ message: 'Nowpayments API Key is required' })
  @IsString()
  nowpayment_apikey: string;

  @ApiProperty({ description: 'Nowpayments IPN Secret' })
  @IsNotEmpty({ message: 'Nowpayments IPN Secret is required' })
  @IsString()
  nowpayment_ipnsecret: string;
}

class TelegramDto {
  @ApiProperty({ description: 'telegram API Key' })
  @IsNotEmpty({ message: 'telegram API Key is required' })
  @IsString()
  telegram_apikey: string;

}

class StripetDto {
  @ApiProperty({ description: 'Stripe API Key' })
  @IsNotEmpty({ message: 'stripe API Key is required' })
  @IsString()
  stripe_apikey: string;

}


class PaystackDto {
  @ApiProperty({ description: 'Paystack API Key' })
  @IsNotEmpty({ message: 'Paystack API Key is required' })
  @IsString()
  paystack_apikey: string;

  @ApiProperty({ description: 'Paystack API Key' })
  @IsNotEmpty({ message: 'Paystack API Key is required' })
  @IsString()
  paystack_publickey: string;
}

class AddressDto {
  @ApiProperty({ description: 'BTC Address' })
  @IsNotEmpty({ message: 'BTC Address is required' })
  @IsString()
  btc_address: string;

  @ApiProperty({ description: 'USDT Address' })
  @IsNotEmpty({ message: 'USDT Address is required' })
  @IsString()
  usdt_address: string;
}
export class CreateBotDto {
  @ApiPropertyOptional({ description: 'Paystack Integration' })
  paystack?: PaystackDto;

  @ApiPropertyOptional({ description: 'Binance Integration' })
  @ValidateNested()
  // Type(() => BinanceDto) // Apply Type decorator to specify the class type
  binance?: BinanceDto;

  @ApiPropertyOptional({ description: 'Coinpayment Integration' })
  @ValidateNested()
  coinpayment?: CoinpaymentDto;

  @ApiPropertyOptional({ description: 'Stripe Integration' })
  @ValidateNested()
  stripe?: StripetDto;

  @ApiPropertyOptional({ description: 'Nowpayments Integration' })
  @ValidateNested()
  nowpayment?: NowpaymentsDto;

  @ApiPropertyOptional({ description: 'Telegram Integration' })
  @ValidateNested()
  telegram: TelegramDto;

  @ApiPropertyOptional({ description: 'Address Integration' })
  @ValidateNested()
  crypto_address?: AddressDto;

  @ApiProperty({ description: 'Group Chat ID' })
  @IsNotEmpty({ message: 'Group Chat ID is required' })
  @IsString()
  groupchatId: string;

  @ApiProperty({ description: 'Telegram group admin ID' })
  @IsNotEmpty({ message: 'Telegram group adminID is required' })
  @IsString()
  adminId: string;

  @ApiProperty({ description: 'Customer Support Telegram' })
  @IsNotEmpty({ message: 'Customer Support Telegram is required' })
  @IsString()
  customersupport_telegram: string;

  @ApiProperty({ description: 'bot Name' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;
  
  @ApiProperty({ description: 'two weeks vip price' })
  @IsNotEmpty({ message: 'twoweeks_price is required' })
  @IsString()
  twoweeks_price: string;

  
  @ApiProperty({ description: 'one month vip price' })
  @IsNotEmpty({ message: 'onemonth_price is required' })
  @IsString()
  onemonth_price: string;

  
  @ApiProperty({ description: 'lifetime vip price' })
  @IsNotEmpty({ message: 'lifetime_price is required' })
  @IsString()
  lifetime_price: string;


  @ApiProperty({ description: 'Success URL' })
  @IsNotEmpty({ message: 'Success URL is required' })
  @IsString()
  success_url: string;

  @ApiProperty({ description: 'user benefit of the subscription vip price' })
  @IsNotEmpty({ message: 'subscription_benefits is required' })
  @IsString()
  subscription_benefits: string;

  @ApiProperty({ description: 'Userid' })
  @IsNotEmpty({ message: 'Userid is required' })
  @IsString()
  userId: string;
}
