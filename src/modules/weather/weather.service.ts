import {
  Injectable,
  HttpService,
} from '@nestjs/common';
import { NotFoundError } from '@gql/common';
import { Coordinate } from '@gql/module/common';
import { Weather } from '@gql/module/weather';
import { transformWeather } from './models/weather.transform';
import { WeatherResponseBody } from './types';

@Injectable()
export class WeatherService {
  private readonly url: string;

  constructor(private readonly httpService: HttpService) {
    this.httpService = httpService;
    this.url = "http://api.openweathermap.org/data/2.5/weather";
  }

  /**
   * Retrieve weather by coordinate.
   *
   * @param coordinate
   * @returns
   */
  async get(coordinate: Coordinate): Promise<void | Weather> {
    return await this.httpService.get(this.url, {
      params: {
        appId: "b07c6aae9638d6fea029603bf5d20c78",
        lat: coordinate?.latitude,
        lon: coordinate?.longitude
      }
    }).toPromise().then(result => {
      const { data: weatherResponseBody }: { data: WeatherResponseBody } = result;
      return transformWeather(weatherResponseBody);
    }).catch(this.handleWeatherErrors);
  }

  handleWeatherErrors(error) {
    const {
      status,
      statusText,
      data,
    } = error.response;
    throw new NotFoundError(
      `weather:: ${status} ${statusText}: ${data.message}`,
    );
  }
}
