import { Module } from '@nestjs/common';
import { RoomInventoryService } from './room-inventory.service';

@Module({
  exports: [RoomInventoryService],
  providers: [RoomInventoryService],
})
export class RoomInventoryModule {}
