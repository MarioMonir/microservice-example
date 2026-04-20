import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '@/modules/users/users.service';
import {
  USERS_REPOSITORY,
  type IUserRepository,
} from '@/modules/users/users.repository';
import type { UserDto } from '@/modules/users/users.schema';

const USER: UserDto = {
  id: '22222222-2222-2222-2222-222222222222',
  name: 'Alice',
};

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    repo = {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: USERS_REPOSITORY, useValue: repo }],
    }).compile();

    service = module.get(UserService);
  });

  it('list returns rows from the repository', async () => {
    repo.list.mockResolvedValue([USER]);
    await expect(service.list()).resolves.toEqual([USER]);
  });

  it('create delegates to the repository', async () => {
    repo.create.mockResolvedValue(USER);
    await expect(service.create({ name: 'Alice' })).resolves.toEqual(USER);
    expect(repo.create).toHaveBeenCalledWith({ name: 'Alice' });
  });

  describe('update', () => {
    it('returns the updated row', async () => {
      const updated = { ...USER, name: 'Alicia' };
      repo.update.mockResolvedValue(updated);
      await expect(
        service.update(USER.id, { name: 'Alicia' }),
      ).resolves.toEqual(updated);
    });

    it('throws NotFoundException when the row is missing', async () => {
      repo.update.mockResolvedValue(null);
      await expect(
        service.update(USER.id, { name: 'Alicia' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  it('delete passes through the repository boolean (no throw)', async () => {
    repo.delete.mockResolvedValue(false);
    await expect(service.delete(USER.id)).resolves.toBe(false);
    expect(repo.delete).toHaveBeenCalledWith(USER.id);
  });
});
