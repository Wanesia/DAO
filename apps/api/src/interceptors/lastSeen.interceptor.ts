import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../user/user.service';

@Injectable()
export class LastSeenInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const jwtPayload = request.user;
    if (jwtPayload?.userId) {
      this.usersService
        .updateLastSeen(jwtPayload.userId)
        .catch((err) => console.error('Failed to update lastSeen:', err));
    }
    return next.handle();
  }
}
