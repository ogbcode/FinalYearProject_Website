
import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

export class CreateAuthDto {
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
  // @Equals('password', { message: 'Passwords do not match' })
  readonly cpassword: string;

}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ConfirmResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Equals('password', { message: 'Passwords do not match' })
  confirmPassword: string;

}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Equals('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Invalid request, authId is required' })
  authId: string;

  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;
}
