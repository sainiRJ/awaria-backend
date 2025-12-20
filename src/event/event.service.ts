import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { League, LeagueDocument } from '../league/schemas/league.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(League.name) private leagueModel: Model<LeagueDocument>
  ) {}

  async getAllEvents() {
    return this.eventModel.find().exec();
  }

  async getEventById(eventId: number) {
    const event = await this.eventModel.findOne({ _id: eventId }).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    return event;
  }

  async getEventsWithLeagueNames() {
    return this.eventModel.aggregate([
      {
        $lookup: {
          from: 'League',
          localField: 'league_id',
          foreignField: '_id',
          as: 'leagueDetails'
        }
      },
      {
        $unwind: '$leagueDetails'
      },
      {
        $project: {
          _id: 1,
          event_title: 1,
          status: 1,
          leagueName: '$leagueDetails.leagueTitle' // Replacing league_id with actual league name
        }
      }
    ]).exec();
  }
}
