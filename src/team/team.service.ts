import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { Event, EventDocument } from '../event/schemas/event.schema';
import { EventCLub, EventCLubDocument } from '../event/schemas/event-club.schema';
@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventCLub.name) private eventClubModel: Model<EventCLubDocument>,
) {}

async getTeams(): Promise<{ _id: string; team_name: string; gender: string; age: string; league_id?: number }[]> {
  const teams = await this.teamModel.aggregate([
    {
      $lookup: {
        from: 'Event_Club',
        localField: 'club_id',
        foreignField: 'club_id',
        as: 'eventClubs'
      }
    },
    { $unwind: { path: '$eventClubs', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'Event',
        localField: 'eventClubs.event_id',
        foreignField: '_id',
        as: 'event'
      }
    },
    { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
    {
      $match: {
        'event.status': 'Current' // Filter only "Current" events
      }
    },
    {
      $project: {
        _id: 1,
        team_name: 1,
        gender: 1,
        age: 1,
        club_id: 1,
        division: 1,
        league_id: '$event.league_id'
      }
    },
    {
      $group: {
        _id: '$_id',
        team_name: { $first: '$team_name' },
        gender: { $first: '$gender' },
        age: { $first: '$age' },
        club_id: { $first: '$club_id' },
        division: { $first: '$division' },
        league_id: { $first: '$league_id' }
      }
    }
  ]).exec();

  return teams;
}


  async getAges(): Promise<{ key: string; label: string }[]> {
    const teams = await this.teamModel.find().select('age').lean().exec();

    // Extract unique age values
    const uniqueAges = Array.from(new Set(teams.map(team => team.age)));

    // Transform age values into key-value format
    return uniqueAges.map(age => ({
      key: age.toString(),
      label: `Under-${age.toString().replace('U', '')}`, // Convert "U14" → "Under-14"
    }));
  }
}
