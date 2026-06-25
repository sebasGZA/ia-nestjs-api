import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthService } from './auth.service';
import { User } from '../user/domain/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let cacheManager: Cache;

  const mockUser: Partial<User> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    createdAt: new Date(),
  };

  const mockQueryBuilder = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn().mockResolvedValue(mockUser),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('access_token');
      expect(result.user).toHaveProperty('id');
      expect(result.user.email).toBe(registerDto.email);
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        ...mockUser,
        password: '$2b$10$hashedPassword',
      } as User);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe(loginDto.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        ...mockUser,
        password: '$2b$10$hashedPassword',
      } as User);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
