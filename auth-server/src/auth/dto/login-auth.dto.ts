import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString({ message: 'user email must be a string' })
  @IsNotEmpty({ message: 'user email cannot be empty' })
  email: string;

  @IsString({ message: 'user password must be a string' })
  @IsNotEmpty({ message: 'user password cannot be empty' })
  password: string;
}
