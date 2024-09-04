import { Injectable } from '@nestjs/common';

import { UserReceiptEntity } from '@entities/user-receipt.entity';

import { CreateUserReceiptDto } from './dto/create-user-receipt.dto';
import { UserReceiptRepository } from './user-receipt.repository';

@Injectable()
export class UserReceiptService {
  constructor(private readonly userReceiptRepository: UserReceiptRepository) {}

  async getById(id: string): Promise<UserReceiptEntity> {
    return await this.userReceiptRepository.findById(id);
  }

  async createUserReceipt(
    dto: CreateUserReceiptDto,
  ): Promise<UserReceiptEntity> {
    return await this.userReceiptRepository.createUserReceipt(dto);
  }
}
