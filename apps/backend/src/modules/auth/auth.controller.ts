import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ConfirmResetPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, description: 'Login successful.' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Version('1')
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({ status: 201, description: 'Password changed succesfully.' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Version('1')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({
    status: 201,
    description: 'A confirmation email has been sent to you.',
  })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.email);
  }

  @Version('1')
  @ApiOperation({ summary: 'Confirm Reset Password' })
  @ApiResponse({ status: 201, description: 'Password reset succefully.' })
  @Post('confirm-reset-password/:token')
  async confirmResetPassword(
    @Param('token') token: string,
    @Body() confirmResetPassword: ConfirmResetPasswordDto,
  ) {
    return this.authService.confirmResetPassword(confirmResetPassword, token);
  }

  @Version('1')
  @ApiOperation({ summary: 'Verify account' })
  @ApiResponse({ status: 201, description: 'Account verified.' })
  @Post('verify-account/:token')
  async verifyAccount(@Param('token') token: string) {
    return this.authService.verifyAccount(token);
  }
}
