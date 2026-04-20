import { Module } from '@nestjs/common';
import { UsersController } from '@/modules/users/users.controller';
import { UserService } from '@/modules/users/users.service';
import {
  UserRepository,
  USERS_REPOSITORY,
} from '@/modules/users/users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    { provide: USERS_REPOSITORY, useClass: UserRepository },
  ],
})
export class UsersModule {}
