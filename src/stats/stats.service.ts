import { Injectable } from '@nestjs/common';
import { TripService } from '../trip/trip.service';
import { MonthlyStats, WeeklyStats } from './stats.models';

@Injectable()
export class StatsService {
  constructor(private tripService: TripService) {}

  async getWeeklyStats(): Promise<WeeklyStats> {
    const date = new Date();
    const currentDateString = date.toISOString();
    const pastDay = new Date().getDate() - 7;
    date.setDate(pastDay);
    const trips = await this.tripService.getLastWeekTrips(
      currentDateString,
      date.toISOString(),
    );

    const weeklyStats = trips.reduce(
      (acc, curr) => {
        return {
          ...acc,
          total_distance: acc.total_distance + curr.distance,
          total_price: acc.total_price + curr.price,
        };
      },
      { total_distance: 0, total_price: 0 },
    );
    return {
      total_distance: `${weeklyStats.total_distance}km`,
      total_price: `${weeklyStats.total_price}PLN`,
    };
  }

  async getMonthlyStats(): Promise<MonthlyStats[]> {}
}
