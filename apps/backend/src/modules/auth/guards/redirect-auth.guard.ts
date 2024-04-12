// Example guard to redirect authenticated users away from the login route

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RedirectAuthenticatedGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.isAuthenticated()) {
      // Redirect authenticated users away from the login route
      // You might want to change the redirect path based on your application's logic
      return request.res.redirect('/dashboard');
    }
    return super.canActivate(context);
  }
}
