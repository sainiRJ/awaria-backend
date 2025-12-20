import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from './schemas/club.schema';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
