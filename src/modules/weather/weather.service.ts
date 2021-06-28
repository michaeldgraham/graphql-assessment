import { Injectable, Logger } from '@nestjs/common';
import { Coordinate } from '@gql/module/common';
import { Weather } from '@gql/module/weather';
import { transformWeather } from './models/weather.transform';
import { WeatherResponseBody } from './types';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  /**
   * Retrieve weather by coordinate.
   *
   * @param coordinate
   * @returns
   */
  async get(coordinate: Coordinate): Promise<Weather> {
    // TODO: Use the openweathermap.org API (https://openweathermap.org/current#geo) to retrive weather data.
    const weatherResponseBody: WeatherResponseBody = null;
    return transformWeather(weatherResponseBody);
  }
}
