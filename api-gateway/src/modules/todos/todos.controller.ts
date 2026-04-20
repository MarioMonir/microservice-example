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
  CreateTodoDto,
  TodoDto,
  UpdateTodoDto,
} from '@/modules/todos/todos.schema';
import { TodosService } from '@/modules/todos/todos.service';

@ApiTags('todos')
@Controller({ path: 'todos', version: '1' })
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOkResponse({ type: TodoDto, isArray: true })
  list(): Promise<TodoDto[]> {
    return this.todosService.list();
  }

  @Post()
  @ApiOkResponse({ type: TodoDto })
  create(@Body() dto: CreateTodoDto): Promise<TodoDto> {
    return this.todosService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TodoDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoDto> {
    return this.todosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return this.todosService.delete(id);
  }
}
