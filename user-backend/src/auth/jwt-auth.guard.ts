import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.headers.refreshtoken;
    console.log(refreshToken);
    if (err || !user) {
      // Surface token-expired vs completely invalid for better client UX
      if (info?.name === 'TokenExpiredError') {
        //Get Refresh Token
      }
      throw err || new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
