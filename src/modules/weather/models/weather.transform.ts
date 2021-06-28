import { Weather } from './weather.model';
import { WeatherResponseBody } from '../types';

export function transformWeather(body?: WeatherResponseBody): Weather {
  if (body?.main) {
    const { feels_like, temp_max, temp_min, ...main } = body.main;
    return {
      ...main,
      feelsLike: feels_like,
      tempMax: temp_max,
      tempMin: temp_min,
    };
  }
  return null;
}
