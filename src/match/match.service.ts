import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { Team, TeamDocument } from '../team/schemas/team.schema';
import {
  MlFixtureProd,
  MlFixtureProdDocument,
} from './schemas/ml-fixture-prod.schema';
import {
  MlInterview,
  MlInterviewDocument,
} from './schemas/ml-interview.schema';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(MlFixtureProd.name)
    private fixtureModel: Model<MlFixtureProdDocument>,
    @InjectModel(MlInterview.name)
    private interviewModel: Model<MlInterviewDocument>,
  ) {}

  async getUpcomingMatchesByTeamId(teamId: string): Promise<any[]> {
    const currentDate = new Date();
    const teamIdNumber = parseInt(teamId); // Ensure teamId is a number

    const matches = await this.matchModel
      .aggregate([
        {
          $addFields: { matchTimeAsDate: { $toDate: '$match_time' } }, // Convert string to Date
        },
        {
          $match: {
            $or: [
              { match_home_team: teamIdNumber },
              { match_away_team: teamIdNumber },
            ],
            matchTimeAsDate: { $gte: currentDate }, // Filter upcoming matches
          },
        },
        {
          $lookup: {
            from: 'Team',
            localField: 'match_home_team',
            foreignField: '_id',
            as: 'homeTeamDetails',
          },
        },
        {
          $lookup: {
            from: 'Team',
            localField: 'match_away_team',
            foreignField: '_id',
            as: 'awayTeamDetails',
          },
        },
        {
          $unwind: {
            path: '$homeTeamDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$awayTeamDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            match_time: 1,
            match_location: 1,
            match_division: 1,
            match_result: 1,
            venue: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: 'home',
                else: 'away',
              },
            },
            teamId: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: '$match_home_team',
                else: '$match_away_team',
              },
            },
            teamName: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: '$homeTeamDetails.team_name',
                else: '$awayTeamDetails.team_name',
              },
            },
            opponentTeamId: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: '$match_away_team',
                else: '$match_home_team',
              },
            },
            opponentName: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: '$awayTeamDetails.team_name',
                else: '$homeTeamDetails.team_name',
              },
            },
          },
        },
        {
          $sort: { matchTimeAsDate: 1 }, // Sort by match date
        },
      ])
      .exec();

    if (!matches.length) {
      throw new NotFoundException(
        `No upcoming matches found for teamId: ${teamId}`,
      );
    }

    return matches.map((match, index) => ({
      ...match,
      report: index === 0 ? 'view' : 'pending',
    }));
  }

  async getNextMatch(teamId: string) {
    const currentDate = new Date();
    const teamIdNumber = parseInt(teamId);

    console.log('teamId', teamId);

    const nextMatch = await this.matchModel
      .aggregate([
        {
          $addFields: { dateTimeAsDate: { $toDate: '$match_time' } }, // Convert match_time to Date
        },
        {
          $match: {
            $or: [
              { match_home_team: teamIdNumber },
              { match_away_team: teamIdNumber },
            ],
            dateTimeAsDate: { $gte: currentDate }, // Future matches only
          },
        },
        {
          $sort: { dateTimeAsDate: 1 }, // Sort by upcoming match
        },
        {
          $limit: 1, // Get the closest match
        },
        {
          $lookup: {
            from: 'Team',
            localField: 'match_home_team',
            foreignField: '_id',
            as: 'homeTeamDetails',
          },
        },
        {
          $lookup: {
            from: 'Team',
            localField: 'match_away_team',
            foreignField: '_id',
            as: 'awayTeamDetails',
          },
        },
        {
          $unwind: {
            path: '$homeTeamDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$awayTeamDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            match_time: 1,
            match_location: 1,
            match_division: 1,
            teamId: teamIdNumber,
            teamName: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: '$homeTeamDetails.team_name',
                else: '$awayTeamDetails.team_name',
              },
            },
            opponentTeamId: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: '$match_away_team',
                else: '$match_home_team',
              },
            },
            opponentName: {
              $cond: {
                if: { $eq: ['$match_home_team', teamIdNumber] },
                then: '$awayTeamDetails.team_name',
                else: '$homeTeamDetails.team_name',
              },
            },
          },
        },
      ])
      .exec();

    // console.log("matches", nextMatch);

    if (!nextMatch.length) {
      throw new NotFoundException(
        `No upcoming matches found for teamId: ${teamId}`,
      );
    }

    return nextMatch[0]; // Return only the first match
  }

  async getLatestFixtureAndInterview(teamId: number, opponentTeamId: number) {
    // Find the latest fixture where the team is either home or away and match_status is Completed
    const latestFixture = await this.fixtureModel
      .find({
        $or: [
          { 'home_team.team_id': teamId, 'away_team.team_id': opponentTeamId },
          { 'home_team.team_id': opponentTeamId, 'away_team.team_id': teamId },
        ],
        match_status: 'Completed',
      })
      .sort({ match_time: -1 })
      .limit(1)
      .lean();

    if (!latestFixture.length) {
      return { message: 'No completed fixture found for the given team ID' };
    }

    const fixture = latestFixture[0];

    // Find the corresponding interview for the latest fixture
    const interview = await this.interviewModel
      .findOne({ fixture_id: fixture.fixture_id })
      .lean();

    return { fixture, interview };
  }

  async getOpponentTeams(teamId: number) {
    // Find all completed fixtures where our team is either home or away
    const fixtures = await this.fixtureModel
      .find({
        $or: [{ 'home_team.team_id': teamId }, { 'away_team.team_id': teamId }],
        match_status: 'Completed',
      })
      .sort({ match_time: -1 })
      .lean();

    if (!fixtures.length) {
      return { message: 'No completed fixtures found for the given team ID' };
    }

    const opponentTeams = fixtures.map((fixture) => {
      if (fixture.home_team.team_id === teamId) {
        return {
          opponent_team_id: fixture.away_team.team_id,
          opponent_team_name: fixture.away_team.team_name,
        };
      } else {
        return {
          opponent_team_id: fixture.home_team.team_id,
          opponent_team_name: fixture.home_team.team_name,
        };
      }
    });

    return opponentTeams;
  }
}
