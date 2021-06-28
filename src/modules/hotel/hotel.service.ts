import { Injectable, Logger } from '@nestjs/common';
import { NotFoundError } from '@gql/common';
import { Hotel, HotelDocument } from '@gql/module/hotel';
import { readFileSync } from 'fs';
import { join } from 'path';
import PouchDB from 'pouchdb';

@Injectable()
export class HotelService {
  private readonly logger = new Logger(HotelService.name);
  private readonly hotelDb: PouchDB.Database;

  constructor() {
    this.hotelDb = new PouchDB('db-hotels', { adapter: 'memory' });
  }

  /**
   * Retrieve hotel by id.
   *
   * @param id
   * @returns
   */
  async get(id: string): Promise<Hotel> {
    // Search for hotel by id
    const hotel: HotelDocument = (
      await this.hotelDb.find({
        selector: { id },
      })
    )?.docs?.pop() as unknown as HotelDocument;

    // Validate that hotel is found
    if (!hotel) {
      throw new NotFoundError(`hotels::${id}`);
    }
    return hotel;
  }

  /**
   * Load mock hotel documents into the database on application startup.
   */
  async onApplicationBootstrap(): Promise<void> {
    // Read mock hotel documents
    const hotelDocs: HotelDocument[] = JSON.parse(
      readFileSync(join(__dirname, '__mockdata__', 'hotels.json'), 'utf8'),
    ).map((hotel) => ({ _id: `hotels::${hotel.id}`, ...hotel }));

    // Bulk load mock hotel documents
    await this.hotelDb.bulkDocs(hotelDocs);
    this.logger.log(
      `Loaded ${hotelDocs.length} hotel documents into the database.`,
    );
  }
}
