import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class AbstractDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsDate()
  @IsOptional()
  deletedAt?: Date;
}
