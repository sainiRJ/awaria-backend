import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsEmail()
  age: number;

  @IsNotEmpty()
  @IsString()
  current_form: string;

  @IsNotEmpty()
  @IsString()
  fitness: string;

  @IsNotEmpty()
  @IsString()
  ai_recommendation: string;

  @IsNotEmpty()
  @IsString()
  status: string ;

  @IsNotEmpty()
  @IsMongoId()
  team_id: string | Types.ObjectId;

  @IsNotEmpty()
  technical_skills: number;
  
  @IsNotEmpty()
  athleticism: number;
  
  @IsNotEmpty()
  game_iq: number;
  
  @IsNotEmpty()
  work_rate:number;
  
  @IsNotEmpty()
  versatility: number;

  @IsNotEmpty()
  player_number:number;

  @IsNotEmpty()
  pos:string;

  @IsNotEmpty()
  player_prompt:string;

  @IsNotEmpty()
  awareia_insight:string;

}
