import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefereeFee, RefereeFeeDocument } from './schemas/referee-fee.schema';

@Injectable()
export class RefereeFeeService {
  constructor(
    @InjectModel(RefereeFee.name) private refereeFeeModel: Model<RefereeFeeDocument>,
  ) {}

  async getRefereeFee(league: string, age_group: string, location: string, isCupGame: boolean) {
    const feeData = await this.refereeFeeModel.findOne({ league, age_group }).lean().exec();

    if (!feeData) {
      throw new NotFoundException(`No fees found for league: ${league}, age group: ${age_group}`);
    }

    let fee;
    if (isCupGame) {
      fee = feeData.cup_game_fee;
    } else if (league === "WYSL") {
      fee = feeData.wysl_fee || "Included in registration";
    } else if (league === "EDP" && location === "Westchester") {
      fee = feeData.westchester_fee;
    } else {
      fee = feeData.standard_fee;
    }

    return { league, age_group, location, fee: fee ? fee : "N/A" };
  }
}
