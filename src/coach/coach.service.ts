import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { LoginCoachDto } from './dto/login-coach.dto';
import {VerifyOtpDto} from './dto/verify-otp.dto'

import { Coach, CoachDocument } from './schemas/coach.schema';
import { Team, TeamDocument } from '../team/schemas/team.schema';
import { CoachTeam, CoachTeamDocument } from './schemas/coach-team.schema';
import {TeamContactInformation, TeamContactInformationDocument} from '../team-contact-information/schemas/team-contact-information.schema'
import { League,LeagueDocument } from 'src/league/schemas/league.schema';

import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Twilio } from 'twilio';
import { comparePasswords, hashPassword } from '../utils/hash.util';

@Injectable()
export class CoachService {
  private twilioClient: Twilio;
  constructor(
    @InjectModel(Coach.name) private coachModel: Model<CoachDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(TeamContactInformation.name) private TeamContactInformationModel: Model<TeamContactInformationDocument>,
    @InjectModel(CoachTeam.name) private coachTeamModel: Model<CoachTeamDocument>,
    @InjectModel(League.name) private leagueModel:Model<LeagueDocument>,

    private readonly jwtService: JwtService,
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error(
        'Twilio credentials are missing in environment variables.',
      );
    }
    this.twilioClient = new Twilio(accountSid, authToken);
  }
  async create(createCoachDto: CreateCoachDto) {
    const { email, mobileNumber, confirmPassword } = createCoachDto;
    let { teamId, password,leagueId } = createCoachDto;

    // Validate required fields
    if (!teamId) {
      throw new BadRequestException('teamId are required.');
    }
    const team_id = parseInt(teamId.toString())
    // Convert to ObjectId if they are not already
    // if (!Types.ObjectId.isValid(leagueId) || !Types.ObjectId.isValid(teamId)) {
    //   throw new BadRequestException('Invalid leagueId or teamId format.');
    // }

    // leagueId = new Types.ObjectId(leagueId);
    // teamId = new Types.ObjectId(teamId);
    // Check if email already exists
    const existingCoach = await this.coachModel.findOne({ email }).exec();
    if (existingCoach) {
      throw new BadRequestException('Email is already in use.');
    }
    if (password != confirmPassword) {
      throw new BadRequestException(
        'Password and Confirm password is not same',
      );
    }
    const teamExist = await this.teamModel.findOne({_id: team_id})
    console.log("teamExist", teamExist);
    // if (!teamExist) {
    //   throw new BadRequestException(' Team does not exist.');
    // }
    // Check if mobile number already exists
    const existingMobile = await this.coachModel
      .findOne({ mobileNumber })
      .exec();
    if (existingMobile) {
      throw new BadRequestException('Mobile number is already in use.');
    }

    try {
      password = await hashPassword(password);
    } catch (error) {
      throw new BadRequestException(
        'Error hashing password. Please try again.',
        error,
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    console.log("otp",otp)
    // try {
    //   // Send OTP via Twilio
    //   await this.twilioClient.messages.create({
    //     body: `Your verification code is: ${otp}`,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: mobileNumber,
    //   });
    // } catch (error) {
    //   console.error('Failed to send OTP via Twilio:', error);
    //   throw new BadRequestException(
    //     'Failed to send OTP. Please try again later.',
    //   );
    // }

    const role = "head coach";

    const newCoach = new this.coachModel({
      ...createCoachDto,
      isVerified: false,
      otp,
      password,
      role: role,
    });
    const savedCoach =  await newCoach.save();

    const newCoachTeam = new this.coachTeamModel({
      coach_id: savedCoach._id,
      team_id: teamId,
      league_id: leagueId
    });
    await newCoachTeam.save();

    return savedCoach;
  }

  async login(loginCoachDto: LoginCoachDto) {
    const { email, password } = loginCoachDto;
    const coach = await this.coachModel.findOne({ email }).exec();

    if (!coach) {
      throw new NotFoundException('Coach not found.');
    }

    if (!coach.isVerified) {
      throw new UnauthorizedException('Account is not verified.');
    }
    const isPasswordValid = await comparePasswords(password, coach.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { id: coach._id, email: coach.email };
    console.log("coach ", coach);
    const coachTeams = await this.coachTeamModel.find({ coach_id: coach._id });
    const teamDetails = await Promise.all(
      coachTeams.map(async (coachTeam) => {
        const team = await this.teamModel.findOne({ _id: coachTeam.team_id });
        return team ? { teamId: team._id, teamName: team.team_name } : null;
      })
    );
    const league=await this.leagueModel.findById(coach.leagueId); 
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      coach: {
        id: coach._id,
        email: coach.email,
        firstName: coach.firstName,
        lastName: coach.lastName,
        role: coach.role,
        team:teamDetails.filter(Boolean),
        league
      },
    };
  }

  async getCoachProfile(token: any) {
    try {
      console.log("token", token);
      // Verify and decode the token
      const coach = await this.coachModel.findById(token.id).exec();

      if (!coach) {
        throw new NotFoundException('Coach not found.');
      }

      const coachTeams = await this.coachTeamModel.find({ coach_id: coach._id });

      const teamDetails = await Promise.all(
        coachTeams.map(async (coachTeam) => {
          const team = await this.teamModel.findOne({ _id: coachTeam.team_id });
          return team ? { teamId: team._id, teamName: team.team_name } : null;
        })
      );
    

      return {
        message: 'Coach data retrieved successfully',
        coach: {
          id: coach._id,
          email: coach.email,
          firstName: coach.firstName,
          lastName: coach.lastName,
          role: coach.role,
          team:  teamDetails.filter(Boolean),
        },
      };
    } catch (error) {
      // console.log(error);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
  findAll() {
    return `This action returns all coach`;
  }

  async findOne(id: number) {
    const coach = await this.coachModel.findOne({ id }).exec();

    return `This action returns a #${id} coach`;
  }

  update(id: number, updateCoachDto: UpdateCoachDto) {
    return `This action updates a #${id} coach`;
  }

  remove(id: number) {
    return `This action removes a #${id} coach`;
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const {mobileNumber, otp} = verifyOtpDto
    const coach = await this.coachModel.findOne({ mobileNumber });
    // const team = await this.teamModel.f

    if (!coach) {
      throw new NotFoundException('Coach not found.');
    }

    if (coach.otp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    // OTP is correct, update verification status
    coach.isVerified = true;
    coach.otp = undefined; // Clear OTP after verification
    await coach.save();

    return { message: 'Mobile number verified successfully.' };
  }
}
