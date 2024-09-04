import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return { message: 'Server is running' };
  }
}
