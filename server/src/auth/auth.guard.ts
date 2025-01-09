import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decoded = this.userService.authorize(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach user information to the request object
    request.user = decoded;
    return true;
  }
}
