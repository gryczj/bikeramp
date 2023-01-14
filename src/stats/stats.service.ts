import { Injectable } from '@nestjs/common';
import { TripService } from '../trip/trip.service';
import { DailyStats, WeeklyStats } from './stats.models';
import { groupBy } from 'lodash';
import { Trip } from '../trip/dto/trip.entity';
import * as moment from 'moment';

@Injectable()
export class StatsService {
  constructor(private tripService: TripService) {}

  async getWeeklyStats(): Promise<WeeklyStats> {
    const date = new Date();
    const currentDateString = date.toISOString();
    const pastDay = new Date().getDate() - 7;
    date.setDate(pastDay);

    const trips = await this.tripService.getTripsByRangeDate(
      currentDateString,
      date.toISOString(),
    );

    const weeklyStats = this.calculateDistanceAndPriceStats(trips);
    return {
      total_distance: `${weeklyStats.distance}km`,
      total_price: `${weeklyStats.price}PLN`,
    };
  }

  async getMonthlyStats(): Promise<DailyStats[]> {
    const date = new Date();
    const currentDateString = date.toISOString();
    date.setDate(1);

    const trips = await this.tripService.getTripsByRangeDate(
      currentDateString,
      date.toISOString(),
    );

    const groupedTrips = groupBy(trips, (t) => t.date);
    return Object.keys(groupedTrips).map((d) =>
      this.getDailyStats(groupedTrips[d]),
    );
  }

  private calculateDistanceAndPriceStats(trips: Trip[]): {
    distance: number;
    price: number;
  } {
    return trips.reduce(
      (acc, cur) => {
        return {
          ...acc,
          distance: acc.distance + cur.distance,
          price: acc.price + cur.price,
        };
      },
      { distance: 0, price: 0 },
    );
  }

  private getDailyStats(trips: Trip[]): DailyStats {
    const ridesNumber = trips.length;
    const calculatedValues = this.calculateDistanceAndPriceStats(trips);
    return {
      day: moment(trips[0].date, 'YYYY-MM-DD').format('MMM, Do'),
      total_distance: `${calculatedValues.distance}km`,
      avg_ride: `${calculatedValues.distance / ridesNumber}km`,
      avg_price: `${calculatedValues.price / ridesNumber}PLN`,
    };
  }
}
