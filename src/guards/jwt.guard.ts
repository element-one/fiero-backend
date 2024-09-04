import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw (
        err ||
        new HttpException(
          { statusCode: 1000, message: 'Login timeout' },
          HttpStatus.UNAUTHORIZED,
        )
      );
    }
    return user;
  }
}
