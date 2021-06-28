import { Injectable, Logger } from '@nestjs/common';
import { Room } from '@gql/module/room-inventory';
import { NotFoundError } from '@gql/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import PouchDB from 'pouchdb';
import { RoomDocument } from './types';

@Injectable()
export class RoomInventoryService {
  private readonly logger = new Logger(RoomInventoryService.name);
  private readonly roomInventoryDb: PouchDB.Database;

  constructor() {
    this.roomInventoryDb = new PouchDB('db-inventory', { adapter: 'memory' });
  }

  /**
   * Retrieve room inventory by hotel id and room number.
   *
   * @param hotelId
   * @param number
   * @returns
   */
  async get(hotelId: string, number: number): Promise<Room> {
    // Search for room inventory by hotel id and room number.
    const room: RoomDocument = (
      await this.roomInventoryDb.find({
        selector: { hotelId, number },
      })
    )?.docs?.pop() as unknown as RoomDocument;

    // Validate that room inventory is found
    if (!room) {
      throw new NotFoundError(`room-inventory::${hotelId}::${number}`);
    }
    return room;
  }

  /**
   * Load mock room inventory documents into the database on application startup.
   */
  async onApplicationBootstrap(): Promise<void> {
    // Read mock room inventory documents
    const roomInventoryDocs: RoomDocument[] = JSON.parse(
      readFileSync(
        join(__dirname, '__mockdata__', 'room-inventory.json'),
        'utf8',
      ),
    ).map((room) => ({
      _id: `room-inventory::${room.hotelId}::${room.number}`,
      ...room,
    }));

    // Bulk load mock room inventory documents
    await this.roomInventoryDb.bulkDocs(roomInventoryDocs);
    this.logger.log(
      `Loaded ${roomInventoryDocs.length} room inventory documents into the database.`,
    );
  }
}
