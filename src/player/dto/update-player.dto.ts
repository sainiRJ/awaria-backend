import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdatePlayerDto {
  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsString()
  expectedReturnDate?: string;

  @IsString()
  status?: string;


}
