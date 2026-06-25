import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IAuthLogin } from '../../domain/interfaces/auth-login.interface';

export class LoginDto implements IAuthLogin {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
