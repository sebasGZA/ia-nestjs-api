import { RegisterDto } from '../../infrastructure/dto/register.dto';
import { LoginDto } from '../../infrastructure/dto/login.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<{
    user: { id: string; name: string; email: string };
    access_token: string;
  }>;
  login(loginDto: LoginDto): Promise<{
    user: { id: string; name: string; email: string };
    access_token: string;
  }>;
}
