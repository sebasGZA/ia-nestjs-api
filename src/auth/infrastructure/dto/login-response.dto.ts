import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;

  @Expose()
  access_token!: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
