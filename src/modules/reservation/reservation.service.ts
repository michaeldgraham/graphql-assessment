import { Inject, Injectable, forwardRef, Logger } from '@nestjs/common';
import { NotFoundError } from '@gql/common';
import { HotelService } from '@gql/module/hotel';
import { RoomInventoryService } from '@gql/module/room-inventory';
import {
  Reservation,
  ReservationDocument,
  ReservationInput,
} from '@gql/module/reservation';
import { transformReservationInput } from './graphql/inputs/reservation.input.transform';
import { transformReservation } from './graphql/objects/reservation.object.transform';
import { addDays, addMonths, startOfDay, startOfMonth } from 'date-fns';
import { readFileSync } from 'fs';
import { join } from 'path';
import PouchDB from 'pouchdb';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);
  private readonly reservationDb: PouchDB.Database;

  constructor(
    @Inject(forwardRef(() => HotelService))
    private readonly hotelService: HotelService,
    private readonly roomInventoryService: RoomInventoryService,
  ) {
    this.reservationDb = new PouchDB('db-reservations', { adapter: 'memory' });
  }

  /**
   *
   * @param reservationInput
   * @returns
   */
   async create(reservationInput: ReservationInput): Promise<Reservation> {
     
    // Validate scheduling
    this.validateSchedule(reservationInput);

    // Resolve hotel
    await this.hotelService.get(reservationInput.hotelId);

    // Resolve rooms
    const rooms = await Promise.all(
      reservationInput.rooms.map((room) =>
        this.roomInventoryService.get(reservationInput.hotelId, room.number),
      ),
    );

    // Convert a reservation input into a reservation object
    const reservation: Reservation = transformReservationInput(
      reservationInput,
      rooms,
    );

    // Create a reservation document
    const reservationDoc: ReservationDocument = {
      ...reservation,
      _id: `reservations::${reservation.confirmationNumber}`,
    };

    await this.reservationDb.put(reservationDoc, { force: true });

    return reservation;
  }

  validateSchedule(reservationInput: ReservationInput) {
    const { arrivalDate, departureDate }: { arrivalDate: Date, departureDate: Date } = reservationInput;
    const arrivalAfterNow = new Date(arrivalDate) >= new Date();
    const departureAfterArrival = new Date(departureDate) > new Date(arrivalDate);
    if(!arrivalAfterNow) throw new NotFoundError(`reservations:: arrivalDate is before current date`);
    if(!departureAfterArrival) throw new NotFoundError(`reservations:: departureDate is not after arrivalDate`);
  }
  
  /**
   * Retrieve reservation by confirmation number.
   *
   * @param confirmationNumber
   * @returns
   */
  async get(confirmationNumber: number): Promise<Reservation> {
    // Search for reservation by confirmation number
    const reservation: ReservationDocument = (
      await this.reservationDb.find({
        selector: { confirmationNumber },
      })
    )?.docs?.pop() as unknown as ReservationDocument;

    // Validate that reservation is found
    if (!reservation) {
      throw new NotFoundError(`reservations::${confirmationNumber}`);
    }
    return transformReservation(reservation);
  }

  /**
   * Load mock reservation documents into the database on application startup.
   */
  async onApplicationBootstrap(): Promise<void> {
    // Read mock reservation documents
    const reservationDocs: ReservationDocument[] = JSON.parse(
      readFileSync(
        join(__dirname, '__mockdata__', 'reservations.json'),
        'utf8',
      ),
    ).map((reservation) => {
      const currentDate = new Date();
      const { arrivalDateOffset, departureDateOffset, ...tReservation } =
        reservation;
      const { expirationDateOffset, ...tCreditCard } =
        reservation.user.creditCard;
      return {
        ...tReservation,
        _id: `reservations::${reservation.confirmationNumber}`,
        arrivalDate: startOfDay(addDays(currentDate, arrivalDateOffset)),
        departureDate: startOfDay(addDays(currentDate, departureDateOffset)),
        user: {
          ...reservation.user,
          creditCard: {
            ...tCreditCard,
            expirationDate: startOfMonth(
              addMonths(currentDate, expirationDateOffset),
            ),
          },
        },
      };
    });

    // Bulk load mock reservation documents
    await this.reservationDb.bulkDocs(reservationDocs);
    this.logger.log(
      `Loaded ${reservationDocs.length} reservation documents into the database.`,
    );
  }
}
