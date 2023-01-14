import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './dto/trip.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateTripDto } from './dto/createTripDto';
import { geoCoder } from './nodeGeocoder';

type Coordinates = { latitude: number; longitude: number };

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
  ) {}

  async saveTrip(trip: CreateTripDto): Promise<void> {
    const { start_address, destination_address, price, date } = trip;
    const distance = await this.calculateDistance(
      start_address,
      destination_address,
    );
    try {
      const tripEntity = this.tripRepository.create({
        distance,
        price,
        date,
      });
      await this.tripRepository.save(tripEntity);
    } catch (e) {
      throw Error(e);
    }
  }

  async getTripsByRangeDate(
    currentDate: string,
    pastDate: string,
  ): Promise<Trip[]> {
    return await this.tripRepository.find({
      where: {
        date: LessThan(currentDate) && MoreThan(pastDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async getTripById(tripId: number): Promise<Trip> {
    return await this.tripRepository.findOneBy({ id: tripId });
  }

  async getTrips(): Promise<Trip[]> {
    return await this.tripRepository.createQueryBuilder('trip').getMany();
  }

  private async calculateDistance(
    startAddress: string,
    destination_address: string,
  ): Promise<number> {
    const decodedStartAddress = await this.getCoordinates(startAddress);
    const decodedDestinationAddress = await this.getCoordinates(
      destination_address,
    );

    const longitude1 = (decodedStartAddress.longitude * Math.PI) / 180;
    const longitude2 = (decodedDestinationAddress.longitude * Math.PI) / 180;
    const latitude1 = (decodedStartAddress.latitude * Math.PI) / 180;
    const latitude2 = (decodedDestinationAddress.latitude * Math.PI) / 180;

    const dLongitude = longitude2 - longitude1;
    const dLatitude = latitude2 - latitude1;
    let a =
      Math.pow(Math.sin(dLatitude / 2), 2) +
      Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.pow(Math.sin(dLongitude / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371;

    return Math.round(c * r);
  }

  private async getCoordinates(address: string): Promise<Coordinates> {
    try {
      const decodedAddress = await geoCoder.geocode(address);
      const { latitude, longitude } = decodedAddress[0];
      return {
        latitude,
        longitude,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
