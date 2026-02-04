/* eslint-disable */
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.session || !request.session.user) {
      throw new ForbiddenException('Session expired. Please login again.');
    }

    return true;
  }
}
