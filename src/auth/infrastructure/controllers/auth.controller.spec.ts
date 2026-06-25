import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../application/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockRegister = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: mockRegister,
            login: mockLogin,
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct data', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        user: { id: '123', name: 'Test User', email: 'test@example.com' },
        access_token: 'token',
      };

      mockRegister.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(mockRegister).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct data', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        user: { id: '123', name: 'Test User', email: 'test@example.com' },
        access_token: 'token',
      };

      mockLogin.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(mockLogin).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
