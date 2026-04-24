import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.headers.refreshtoken;
    console.log(refreshToken);
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
      }
      throw err || new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
