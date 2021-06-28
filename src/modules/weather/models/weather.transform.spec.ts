import { WeatherResponseBody } from '@gql/module/weather';
import { transformWeather } from './weather.transform';

const mockWeatherResponseBody = {
  coord: {
    lon: 97.7431,
    lat: 30.2672,
  },
  weather: [
    {
      id: 804,
      main: 'Clouds',
      description: 'overcast clouds',
      icon: '04n',
    },
  ],
  base: 'stations',
  main: {
    temp: 277.65,
    feels_like: 275.61,
    temp_min: 277.65,
    temp_max: 277.65,
    pressure: 1014,
    humidity: 96,
  },
  visibility: 46,
  wind: {
    speed: 2.33,
    deg: 346,
    gust: 2.23,
  },
  clouds: {
    all: 100,
  },
  dt: 1622378702,
  sys: {
    country: 'CN',
    sunrise: 1622327314,
    sunset: 1622377492,
  },
  timezone: 28800,
  id: 1279592,
  name: 'Yanduo',
  cod: 200,
};

const mockExpectedWeather = {
  temp: 277.65,
  pressure: 1014,
  humidity: 96,
  feelsLike: 275.61,
  tempMax: 277.65,
  tempMin: 277.65,
};

describe('transformWeather()', () => {
  test.each([
    ['With null body', null, null],
    ['With empty body', {}, null],
    ['With empty body', mockWeatherResponseBody, mockExpectedWeather],
  ])('%s', (_, body, expected) => {
    const weather = transformWeather(body as unknown as WeatherResponseBody);
    expect(weather).toEqual(expected);
  });
});
