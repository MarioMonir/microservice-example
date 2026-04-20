import { Injectable } from '@nestjs/common';
import { DBService } from '@/common/db/db.service';
import { isNotFound } from '@/common/errors/common.errors';
import {
  CreateUserDto,
  UserDto,
  UpdateUserDto,
} from '@/modules/users/users.schema';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface IUserRepository {
  list(): Promise<UserDto[]>;
  create(data: CreateUserDto): Promise<UserDto>;
  update(id: string, patch: UpdateUserDto): Promise<UserDto | null>;
  delete(id: string): Promise<boolean>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly db: DBService) {}

  list(): Promise<UserDto[]> {
    return this.db.user.findMany();
  }

  create(data: CreateUserDto): Promise<UserDto> {
    return this.db.user.create({ data });
  }

  async update(id: string, patch: UpdateUserDto): Promise<UserDto | null> {
    try {
      return await this.db.user.update({ where: { id }, data: patch });
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.user.delete({ where: { id } });
      return true;
    } catch (err) {
      if (isNotFound(err)) return false;
      throw err;
    }
  }
}
