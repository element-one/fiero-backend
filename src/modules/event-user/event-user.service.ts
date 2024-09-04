import { Injectable } from '@nestjs/common';

import { ApiSuccessResponse } from '@dtos/api/api-success-response.dto';
import { EventUserEntity } from '@entities/event-user.entity';
import { UserEmailExistsException } from '@exceptions/user-email-exists';

import { EventUserDto } from './dto/event-user.dto';
import { EventUserRepository } from './event-user.repository';

@Injectable()
export class EventUserService {
  constructor(private readonly eventUserRepository: EventUserRepository) {}

  async getEventUser(id: string): Promise<EventUserEntity> {
    const eventUser = await this.eventUserRepository.findById(id);
    return eventUser;
  }

  async saveEventUser(dto: EventUserDto): Promise<ApiSuccessResponse> {
    const eventUser = await this.eventUserRepository.findByEmail(dto.email);
    if (eventUser) {
      throw new UserEmailExistsException();
    }
    const newEventUser = this.eventUserRepository.create({
      ...dto,
    });
    await this.eventUserRepository.save(newEventUser);
    return new ApiSuccessResponse();
  }
}
