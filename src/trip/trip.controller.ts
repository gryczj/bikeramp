import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/createTripDto';
import { Trip } from './dto/trip.entity';

@Controller('trip')
export class TripController {
  constructor(private tripService: TripService) {}

  @Post()
  async createTrip(
    @Body() createTripDto: CreateTripDto,
  ): Promise<{ code: number; message: string }> {
    try {
      await this.tripService.saveTrip(createTripDto);
      return {
        code: 200,
        message: 'Trip saved.',
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  async getTrip(@Param('id') tripId: number): Promise<Trip> {
    try {
      return await this.tripService.getTripById(tripId);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('all')
  async getTrips(): Promise<Trip[]> {
    try {
      return await this.tripService.getTrips();
    } catch (e) {
      throw new Error(e);
    }
  }
}
