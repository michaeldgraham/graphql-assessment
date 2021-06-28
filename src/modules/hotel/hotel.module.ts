import { Module } from '@nestjs/common';
import { HotelResolver } from './hotel.resolver';
import { HotelService } from './hotel.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  exports: [HotelService, WeatherModule],
  imports: [WeatherModule],
  providers: [HotelResolver, HotelService],
})
export class HotelModule {}
