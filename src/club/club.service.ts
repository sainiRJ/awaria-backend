import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from './schemas/club.schema';

@Injectable()
export class ClubService {
  constructor(@InjectModel(Club.name) private clubModel: Model<ClubDocument>) {}

  async getClubs(): Promise<{ _id: string; club_name: string; club_website: string }[]> {
    const clubs = await this.clubModel.find().lean().exec();
    return clubs
  }
}
