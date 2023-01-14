import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TripModule } from '../trip/trip.module';

@Module({
  imports: [TripModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
