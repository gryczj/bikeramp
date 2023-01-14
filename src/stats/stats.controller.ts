import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Trip } from '../trip/dto/trip.entity';
import { MonthlyStats, WeeklyStats } from './stats.models';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('weekly')
  async getWeeklyStats(): Promise<WeeklyStats> {
    return await this.statsService.getWeeklyStats();
  }

  @Get('monthly')
  async getMonthlyStats(): Promise<MonthlyStats[]> {
    return await this.statsService.getMonthlyStats();
  }
}
