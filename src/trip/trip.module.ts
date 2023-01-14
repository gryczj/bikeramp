import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './dto/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  exports: [TripService],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule {}
