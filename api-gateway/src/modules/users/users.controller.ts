import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  UserDto,
  UpdateUserDto,
} from '@/modules/users/users.schema';
import { UserService } from '@/modules/users/users.service';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserDto, isArray: true })
  list(): Promise<UserDto[]> {
    return this.usersService.list();
  }

  @Post()
  @ApiOkResponse({ type: UserDto })
  create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
