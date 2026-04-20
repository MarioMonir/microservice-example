import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from '@/modules/users/users.schema';
import {
  UserRepository,
  USERS_REPOSITORY,
} from '@/modules/users/users.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly repo: UserRepository,
  ) {}

  list(): Promise<UserDto[]> {
    return this.repo.list();
  }

  create(data: CreateUserDto): Promise<UserDto> {
    return this.repo.create(data);
  }

  async update(id: string, data: UpdateUserDto): Promise<UserDto> {
    const updated = await this.repo.update(id, data);
    if (!updated) throw new NotFoundException(`user ${id} not found`);
    return updated;
  }

  delete(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
