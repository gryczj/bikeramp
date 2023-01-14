import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { DailyStats, WeeklyStats } from './stats.models';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('weekly')
  async getDistanceAndPriceStats(): Promise<WeeklyStats> {
    return await this.statsService.getWeeklyStats();
  }

  @Get('monthly')
  async getMonthlyStats(): Promise<DailyStats[]> {
    return await this.statsService.getMonthlyStats();
  }
}
