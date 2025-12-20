import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCoachDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @Length(6, 20)
  confirmPassword: string;

  @IsNotEmpty()
  @Length(10, 15)
  mobileNumber: string;

  @IsNotEmpty()
  @IsMongoId()
  leagueId: string | Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  teamId: string | Types.ObjectId;
}
