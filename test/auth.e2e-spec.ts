import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/user/domain/entitites/user.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [User],
          synchronize: true,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/v1/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/v1/register')
        .send({
          name: 'Test User',
          email: 'test-e2e@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe('test-e2e@example.com');
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 409 if email already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/v1/register')
        .send({
          name: 'Test User',
          email: 'test-e2e@example.com',
          password: 'password123',
        })
        .expect(409);
    });

    it('should return 400 for invalid input', () => {
      return request(app.getHttpServer())
        .post('/auth/v1/register')
        .send({
          name: 'T',
          email: 'invalid-email',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('/auth/v1/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/v1/login')
        .send({
          email: 'test-e2e@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user.email).toBe('test-e2e@example.com');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/v1/login')
        .send({
          email: 'test-e2e@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
