import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';

import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Daily,
  Holiday,
  Leave,
  Meeting,
  Msg,
  Order,
  Remind,
  User,
  VoiceChannels,
  WorkFromHome,
  CompanyTrip,
  Opentalk,
  Uploadfile,
  CheckList,
  Subcategorys,
  BirthDay,
  Bwl,
  BwlReaction,
  CheckCamera,
  Conversation,
  Dating,
  GuildData,
  JoinCall,
  Keep,
  Penalty,
  Quiz,
  TimeVoiceAlone,
  TrackerSpentTime,
  TX8,
  UserQuiz,
  Wiki,
  WomenDay,
  Channel,
  Mentioned,
  Workout,
  IndividualChannel,
  EventEntity,
  ImportantSMS,
  WOL,
  Dynamic,
} from './models';
import { BotGateway } from './events/bot.gateway';
import { DailyCommand } from './asterisk-commands/commands/daily/daily.command';
import { Asterisk } from './asterisk-commands/asterisk';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { TimeSheetService } from './services/timesheet.services';

// import { CronjobSlashCommand } from "./slash-commands/cronjob.slashcommand";

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Disable SSL certificate validation
      }),
    }),
    DiscoveryModule,
    TypeOrmModule.forFeature([
      BwlReaction,
      Bwl,
      Daily,
      Penalty,
      Order,
      Leave,
      Holiday,
      User,
      Meeting,
      VoiceChannels,
      WorkFromHome,
      Msg,
      Remind,
      Uploadfile,
      Opentalk,
      CompanyTrip,
      CheckList,
      Subcategorys,
      Channel,
      Daily,
      TX8,
      WomenDay,
      BirthDay,
      UserQuiz,
      Dating,
      JoinCall,
      CheckCamera,
      TrackerSpentTime,
      Conversation,
      TimeVoiceAlone,
      GuildData,
      Quiz,
      Keep,
      Wiki,
      Workout,
      Mentioned,
      IndividualChannel,
      EventEntity,
      ImportantSMS,
      WOL,
      Dynamic,
    ]),
  ],
  providers: [BotGateway, DailyCommand, Asterisk, TimeSheetService],
  controllers: [],
})
export class BotModule {}
