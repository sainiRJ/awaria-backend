import { Length, IsString,  IsNotEmpty, } from 'class-validator';

export class VerifyOtpDto {
 @IsNotEmpty()
  @Length(10, 15)
  mobileNumber: string;


  @IsString()
  otp: string;
}