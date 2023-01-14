import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './trip.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from './dto/trip.entity';

describe('TripService', () => {
  let service: TripService;
  let tripRepositoryMock;

  beforeEach(async () => {
    tripRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getRepositoryToken(Trip),
          useValue: tripRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get coordinates for address', async () => {
    const address = 'Plac Europejski 2, Warszawa, Polska';
    const expectedResult = {
      latitude: 52.232801,
      longitude: 20.9840589,
    };
    const result = await service.getCoordinates(address);
    expect(result).toStrictEqual(expectedResult);
  });

  xit('should throw an error when street is invalid', async () => {
    const address = 'Nie ma takiej ulicy, Warszawa, Polska';
    const expectedResult = {
      latitude: 52.232801,
      longitude: 20.9840589,
    };
    const result = await service.getCoordinates(address);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should calculate distance between two places', async () => {
    const address1 = 'Plac Europejski 2, Warszawa, Polska';
    const address2 = 'Bakalarska 11, Warszawa, Polska';
    const result = await service.calculateDistance(address1, address2);
    expect(result).toStrictEqual(5);
  });
});
