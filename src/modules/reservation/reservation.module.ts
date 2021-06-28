import { Module } from '@nestjs/common';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { HotelModule } from '../hotel/hotel.module';
import { RoomInventoryModule } from '../room-inventory/room-inventory.module';

@Module({
  imports: [HotelModule, RoomInventoryModule],
  exports: [ReservationService, HotelModule, RoomInventoryModule],
  providers: [ReservationResolver, ReservationService],
})
export class ReservationModule {}
