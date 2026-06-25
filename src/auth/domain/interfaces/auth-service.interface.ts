import { IAuthLogin } from './auth-login.interface';
import { IAuthRegister } from './auth-register.interface';

export interface IAuthService {
  register(registerDto: IAuthRegister): Promise<{
    user: { id: string; name: string; email: string };
    access_token: string;
  }>;
  login(loginDto: IAuthLogin): Promise<{
    user: { id: string; name: string; email: string };
    access_token: string;
  }>;
}
