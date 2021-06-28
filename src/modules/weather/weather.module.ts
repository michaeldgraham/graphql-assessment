import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Module({
  exports: [WeatherService],
  providers: [WeatherService],
})
export class WeatherModule {}
