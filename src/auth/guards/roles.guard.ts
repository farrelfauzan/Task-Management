import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('roles', roles);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const session = request.session;
    console.log('session', session);
    return roles.some((role) => session.user.role.includes(role));
  }
}
