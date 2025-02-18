import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { verify } from 'jsonwebtoken';

@Injectable()
export class VerifyLogin implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const headers = context.switchToHttp().getRequest().headers;
    const access_token = headers['x-access-token'];


    try {
      const  {sub: id}: any = verify(access_token, process.env.JWT_SECRET);

      if (!id) return false;

      const user = await this.usersService.findOneByAuthId(id);
      const { auth: { password, ...updatedAuth }, ...updatedUser } = user;
      const updatedUserWithoutPassword = { ...updatedUser, auth: updatedAuth };

      request.user = updatedUserWithoutPassword;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
