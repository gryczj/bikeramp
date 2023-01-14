import { Injectable } from '@nestjs/common';
import { TripService } from '../trip/trip.service';
import { DailyStats, DistanceAndPriceStats } from './stats.models';
import { groupBy } from 'lodash';
import { Trip } from '../trip/dto/trip.entity';
import * as moment from 'moment';

@Injectable()
export class StatsService {
  constructor(private tripService: TripService) {}

  private calculateDistanceAndPriceStats(
    trips: Trip[],
  ): DistanceAndPriceStats {}

  async getWeeklyStats(): Promise<DistanceAndPriceStats> {
    const date = new Date();
    const currentDateString = date.toISOString();
    const pastDay = new Date().getDate() - 7;
    date.setDate(pastDay);
    const trips = await this.tripService.getTripsByRangeDate(
      currentDateString,
      date.toISOString(),
    );

    const DistanceAndPriceStats = trips.reduce(
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
      total_distance: `${DistanceAndPriceStats.total_distance}km`,
      total_price: `${DistanceAndPriceStats.total_price}PLN`,
    };
  }

  getDailyStats(trips: Trip[]): DailyStats {
    const ridesNumber = trips.length;
    const calculatedValues = trips.reduce(
      (acc, cur) => {
        return {
          ...acc,
          total_distance: acc.total_distance + cur.distance,
          total_price: acc.total_price + cur.price,
        };
      },
      { total_distance: 0, total_price: 0 },
    );

    return {
      day: moment(trips[0].date, 'YYYY-MM-DD').format('MMM, Do'),
      total_distance: `${calculatedValues.total_distance}km`,
      avg_ride: `${calculatedValues.total_distance / ridesNumber}km`,
      avg_price: `${calculatedValues.total_price / ridesNumber}PLN`,
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
}
