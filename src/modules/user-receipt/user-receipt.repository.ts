import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserReceiptEntity } from '@entities/user-receipt.entity';

import { CreateUserReceiptDto } from './dto/create-user-receipt.dto';

@Injectable()
export class UserReceiptRepository extends Repository<UserReceiptEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserReceiptEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserReceiptEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async createUserReceipt(
    dto: CreateUserReceiptDto,
  ): Promise<UserReceiptEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }
}
