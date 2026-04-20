import { Test, TestingModule } from '@nestjs/testing';
import { DBService } from '@/common/db/db.service';
import { UserRepository } from '@/modules/users/users.repository';
import type { UserDto } from '@/modules/users/users.schema';

const USER: UserDto = {
  id: '22222222-2222-2222-2222-222222222222',
  name: 'Alice',
};

type UserDelegate = {
  findMany: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('UserRepository', () => {
  let repo: UserRepository;
  let db: { user: UserDelegate };

  beforeEach(async () => {
    db = {
      user: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, { provide: DBService, useValue: db }],
    }).compile();

    repo = module.get(UserRepository);
  });

  it('list returns rows from findMany', async () => {
    db.user.findMany.mockResolvedValue([USER]);
    await expect(repo.list()).resolves.toEqual([USER]);
    expect(db.user.findMany).toHaveBeenCalledWith();
  });

  it('create passes data through', async () => {
    db.user.create.mockResolvedValue(USER);
    await expect(repo.create({ name: 'Alice' })).resolves.toEqual(USER);
    expect(db.user.create).toHaveBeenCalledWith({ data: { name: 'Alice' } });
  });

  describe('update', () => {
    it('returns the updated row', async () => {
      const updated = { ...USER, name: 'Alicia' };
      db.user.update.mockResolvedValue(updated);
      await expect(repo.update(USER.id, { name: 'Alicia' })).resolves.toEqual(
        updated,
      );
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: USER.id },
        data: { name: 'Alicia' },
      });
    });

    it('returns null on P2025', async () => {
      db.user.update.mockRejectedValue({ code: 'P2025' });
      await expect(
        repo.update(USER.id, { name: 'Alicia' }),
      ).resolves.toBeNull();
    });

    it('rethrows any other error', async () => {
      const boom = new Error('boom');
      db.user.update.mockRejectedValue(boom);
      await expect(repo.update(USER.id, { name: 'Alicia' })).rejects.toBe(boom);
    });
  });

  describe('delete', () => {
    it('returns true on success', async () => {
      db.user.delete.mockResolvedValue(undefined);
      await expect(repo.delete(USER.id)).resolves.toBe(true);
    });

    it('returns false on P2025', async () => {
      db.user.delete.mockRejectedValue({ code: 'P2025' });
      await expect(repo.delete(USER.id)).resolves.toBe(false);
    });

    it('rethrows any other error', async () => {
      const boom = new Error('boom');
      db.user.delete.mockRejectedValue(boom);
      await expect(repo.delete(USER.id)).rejects.toBe(boom);
    });
  });
});
