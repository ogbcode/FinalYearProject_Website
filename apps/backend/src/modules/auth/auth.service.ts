import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  ChangePasswordDto,
  ConfirmResetPasswordDto,
  CreateAuthDto,
  LoginUserDto,
} from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
// import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { AuthProps } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    // private mailService: MailService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<Auth> {
    const auth = await this.findOneByEmail(createAuthDto.email);

    if (auth) {
      throw new Error('Auth already exists!');
    }

    if (!this.passwordService.checkPasswordStrength(createAuthDto.password)) {
      throw new Error('Password is too weak');
    }

    const authProps: AuthProps = {
      ...createAuthDto,
      password: await this.passwordService.hashPassword(createAuthDto.password),
    };

    const newAuth = this.authRepository.create({
      ...authProps,
    });

    return await this.authRepository.save(newAuth);
  }

  async findOneByEmail(email: string) {
    return await this.authRepository.findOne({
      where: { email },
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const auth = await this.authRepository.findOneBy({ id });

    if (!auth) {
      throw new Error('Auth does not exist!');
    }
    return auth;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.passwordService.comparePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password: _, ...userInfo } = user;
    return userInfo;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async update(updateAuthDto: UpdateAuthDto) {
    const auth = await this.findOneByEmail(updateAuthDto.email);

    if (!auth) {
      throw new Error('Auth does not exist!');
    }

    return await this.authRepository.update(auth, updateAuthDto);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.password !== changePasswordDto.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const auth = await this.findOne(changePasswordDto.authId);

    if (
      !this.passwordService.comparePassword(
        changePasswordDto.oldPassword,
        auth.password,
      )
    ) {
      throw new Error('Incorrect old password');
    }

    if (
      !this.passwordService.checkPasswordStrength(changePasswordDto.password)
    ) {
      throw new Error('Password is too weak');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePasswordDto.password,
    );

    return await this.authRepository
      .update(auth, { password: hashedPassword })
      .then(() => {
        message: 'Password changed successfully';
      });
  }

  async resetPassword(email: string) {
    const auth = await this.findOneByEmail(email);
    const token = this.jwtService.sign({ sub: auth.id });

    if (!auth) {
      throw new Error('Auth does not exist');
    }

    // Send a confirmation url(contains jwt token) to the user via email
    // await this.mailService.sendResetPassword(auth, token);

    return { message: 'A confirmation email has been sent to you.' };
  }

  async confirmResetPassword(
    confirmResetPasswordDto: ConfirmResetPasswordDto,
    token: string,
  ) {
    if (
      confirmResetPasswordDto.password !==
      confirmResetPasswordDto.confirmPassword
    ) {
      throw new Error('Passwords do not match');
    }

    const authId = this.jwtService.decode(token.split(' ')[1]).id;
    const auth = await this.findOne(authId);
    const hashedPassword = await this.passwordService.hashPassword(
      confirmResetPasswordDto.password,
    );

    return await this.authRepository
      .update(auth, { password: hashedPassword })
      .then(() => {
        message: 'Password reset successfully';
      });
  }

  async verifyAccount(token: string) {
    const auth = await this.findOne(this.jwtService.decode(token).id);

    if (!auth) {
      throw new Error('Auth does not exist!');
    }

    auth.isVerified = true;

    const updatedAuth: UpdateAuthDto = {
      ...auth,
    };

    return await this.update(updatedAuth).then(() => {
      message: 'Account verified successfully';
    });
  }
}
