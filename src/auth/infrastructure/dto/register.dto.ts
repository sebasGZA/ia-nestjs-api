import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAuthRegister } from '../../domain/interfaces/auth-register.interface';

export class RegisterDto implements IAuthRegister {
  @ApiProperty({
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
    description: 'User full name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
