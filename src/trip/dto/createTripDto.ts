import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  start_address: string;

  @IsNotEmpty()
  @IsString()
  destination_address: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}
