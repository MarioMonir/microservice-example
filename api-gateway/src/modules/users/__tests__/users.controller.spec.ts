import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/modules/users/users.controller';
import { UserService } from '@/modules/users/users.service';
import type { UserDto } from '@/modules/users/users.schema';

const USER: UserDto = {
  id: '22222222-2222-2222-2222-222222222222',
  name: 'Alice',
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    service = {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();

    controller = module.get(UsersController);
  });

  it('list returns service result', async () => {
    service.list.mockResolvedValue([USER]);
    await expect(controller.list()).resolves.toEqual([USER]);
  });

  it('create forwards the DTO', async () => {
    service.create.mockResolvedValue(USER);
    await expect(controller.create({ name: 'Alice' })).resolves.toEqual(USER);
    expect(service.create).toHaveBeenCalledWith({ name: 'Alice' });
  });

  it('update forwards id and body', async () => {
    const updated = { ...USER, name: 'Alicia' };
    service.update.mockResolvedValue(updated);
    await expect(
      controller.update(USER.id, { name: 'Alicia' }),
    ).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(USER.id, { name: 'Alicia' });
  });

  it('delete forwards id', async () => {
    service.delete.mockResolvedValue(true);
    await expect(controller.delete(USER.id)).resolves.toBe(true);
    expect(service.delete).toHaveBeenCalledWith(USER.id);
  });
});
