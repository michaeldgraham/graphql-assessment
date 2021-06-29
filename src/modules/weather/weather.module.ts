import { Module, HttpModule } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Module({
  imports: [HttpModule],
  exports: [WeatherService],
  providers: [WeatherService],
})
export class WeatherModule {}
