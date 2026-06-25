import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User unique identifier',
  })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Expose()
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @Expose()
  email!: string;

  @Exclude()
  password!: string;

  @ApiProperty({
    example: '2026-06-25T10:00:00.000Z',
    description: 'Account creation date',
  })
  @Expose()
  createdAt!: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
