import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefereeFee, RefereeFeeSchema } from './schemas/referee-fee.schema';
import { RefereeFeeService } from './referee-fee.service';
import { RefereeFeeController } from './referee-fee.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: RefereeFee.name, schema: RefereeFeeSchema }])],
  controllers: [RefereeFeeController],
  providers: [RefereeFeeService],
})
export class RefereeFeeModule {}
