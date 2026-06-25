import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { User } from '../../../user/domain/user.entity';
import { RegisterDto } from '../../infrastructure/dto/register.dto';
import { LoginDto } from '../../infrastructure/dto/login.dto';
import { IAuthService } from '../../domain/interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      await this.cacheManager.set(`user_${savedUser.id}`, savedUser, 300000);

      const token = this.generateToken(savedUser);

      this.logger.log(`User registered: ${savedUser.id}`);

      return {
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
        },
        access_token: token,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const cacheKey = `user_email_${email}`;
    let user: User | null = null;

    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      user = cachedUser;
    } else {
      user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, name: true, email: true, password: true },
      });

      if (user) {
        await this.cacheManager.set(cacheKey, user, 300000);
      }
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    this.logger.log(`User logged in: ${user.id}`);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      access_token: token,
    };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
