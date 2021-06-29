import { WeatherService } from '@gql/module/weather';
import { HttpService } from '@nestjs/common';

describe('WeatherService', () => {
  let httpService: HttpService;
  let weatherService: WeatherService;

  beforeEach(() => {
    httpService = new HttpService();
    weatherService = new WeatherService(httpService);
  });

  describe('get()', () => {
    it('Weather found for coordinate', async () => {
      const mockCoordinate = {
        "latitude": 32.811506,
        "longitude": -96.858195
      };
      const weather = await weatherService.get(mockCoordinate);
      expect(weather).toEqual({
        "feelsLike": expect.any(Number),
        "humidity": expect.any(Number),
        "pressure": expect.any(Number),
        "temp": expect.any(Number),
        "tempMax": expect.any(Number),
        "tempMin": expect.any(Number)
      });
    });

    it('Weather not found for coordinate', async () => {
      const mockCoordinate = {
        "latitude": 97.7431,
        "longitude": 30.2672
      };
      await expect(weatherService.get(mockCoordinate)).rejects.toThrow(
        'Cannot find record: weather:: 400 Bad Request: wrong latitude',
      );
    });
  });
});
