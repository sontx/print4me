import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Products } from './products.decorator';

@Injectable()
export class ProductGuard implements CanActivate {
  private logger = new Logger(ProductGuard.name, { timestamp: true });

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    const products =
      this.reflector.get(Products, context.getHandler()) ||
      this.reflector.get(Products, context.getClass());
    if (!products?.length) {
      this.logger.warn('No defined products for ProductGuard');
      return true;
    }

    const matched = products.includes(user.product);
    if (!matched) {
      this.logger.warn(
        `User ${user.email} is trying to access ${request.url} which is not allowed because this user is only belong to ${user.product}`,
      );
    }
    return matched;
  }
}
