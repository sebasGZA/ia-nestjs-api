import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class RegisterResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  access_token: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
