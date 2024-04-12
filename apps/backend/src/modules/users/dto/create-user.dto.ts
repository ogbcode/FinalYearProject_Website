import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, Validate } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  middleName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email should be a string' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  @IsString({ message: 'Password should be a string' })
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsString({ message: 'Confirm password should be a string' })

  readonly cpassword: string;

}
