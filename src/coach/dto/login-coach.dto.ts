import { IsEmail, IsString } from 'class-validator';

export class LoginCoachDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}