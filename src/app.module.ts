import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import PouchDB from 'pouchdb';
import PouchDBInMemory from 'pouchdb-adapter-memory';
import PouchDBFind from 'pouchdb-find';
import { HotelModule } from './modules/hotel/hotel.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { RoomInventoryModule } from './modules/room-inventory/room-inventory.module';
import { WeatherModule } from './modules/weather/weather.module';

// Register PouchDB in-memory and find plugins
PouchDB.plugin(PouchDBInMemory);
PouchDB.plugin(PouchDBFind);

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.graphql'),
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
      },
      sortSchema: true,
    }),
    HotelModule,
    ReservationModule,
    RoomInventoryModule,
    WeatherModule,
  ],
})
export class AppModule {}
