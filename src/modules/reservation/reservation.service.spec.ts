const mockPouchDb = jest.fn();
const mockPouchDbFind = jest.fn();
const mockPouchDbPut = jest.fn();
jest.mock('pouchdb', () => mockPouchDb);

const mockTransformReservation = jest.fn();
jest.mock('./graphql/objects/reservation.object.transform', () => ({
  transformReservation: mockTransformReservation,
}));

const mockTransformReservationInput = jest.fn();
jest.mock('./graphql/inputs/reservation.input.transform', () => ({
  transformReservationInput: mockTransformReservationInput,
}));

const mockHotelServiceGet = jest.fn();
const mockRoomInventoryServiceGet = jest.fn();

import { HotelService } from '@gql/module/hotel';
import { ReservationService } from '@gql/module/reservation';
import { RoomInventoryService } from '@gql/module/room-inventory';
import { ReservationInput } from './graphql/inputs/reservation.input';

describe('ReservationService', () => {
  let reservationService: ReservationService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockPouchDb.mockImplementation(() => ({
      find: mockPouchDbFind,
      put: mockPouchDbPut,
    }));
    mockTransformReservation.mockImplementation((res) => res);
    mockTransformReservationInput.mockImplementation((res) => ({
      ...res,
      confirmationNumber: 123456789,
    }));
    mockHotelServiceGet.mockImplementation((id) => ({ id }));
    mockRoomInventoryServiceGet.mockImplementation((hotelId, number) => ({
      hotelId,
      number,
    }));

    const mockHotelService: HotelService = {
      get: mockHotelServiceGet,
    } as unknown as HotelService;
    const mockRoomInventoryService: RoomInventoryService = {
      get: mockRoomInventoryServiceGet,
    } as unknown as RoomInventoryService;
    reservationService = new ReservationService(
      mockHotelService,
      mockRoomInventoryService,
    );
  });

  describe('create()', () => {
    it('Successful', async () => {
      const reservationInput = {
        hotelId: 'DALPAGI',
        rooms: [{ number: 123 }],
        // Taken from the result of /sample-queries/reservationQuery.md
        arrivalDate: "2021-07-02T07:00:00.000Z",
        departureDate: "2021-07-19T07:00:00.000Z"
      } as unknown as ReservationInput;
      const mockReservation = {
        ...reservationInput,
        confirmationNumber: 123456789,
      };

      const reservation = await reservationService.create(reservationInput);

      expect(reservation).toEqual(mockReservation);
      expect(mockHotelServiceGet).toHaveBeenCalledWith('DALPAGI');
      expect(mockRoomInventoryServiceGet).toHaveBeenCalledWith('DALPAGI', 123);
      expect(mockTransformReservationInput).toHaveBeenCalledWith(
        reservationInput,
        [{ hotelId: 'DALPAGI', number: 123 }],
      );
      expect(mockPouchDbPut).toHaveBeenCalledWith(
        {
          ...reservation,
          _id: 'reservations::123456789',
        },
        { force: true },
      );
    });

    it('Not successful: arrivalDate is before current date', async () => {
      const reservationInput = {
        hotelId: 'DALPAGI',
        rooms: [{ number: 123 }],
        arrivalDate: "2020-07-02T07:00:00.000Z",
        departureDate: "2021-07-19T07:00:00.000Z"
      } as unknown as ReservationInput;
      await expect(reservationService.create(reservationInput)).rejects.toThrow(
        'Cannot find record: reservations:: arrivalDate is before current date',
      );
    });

    it('Not successful: departureDate is not after arrivalDate', async () => {
      const reservationInput = {
        hotelId: 'DALPAGI',
        rooms: [{ number: 123 }],
        arrivalDate: "2021-07-02T07:00:00.000Z",
        departureDate: "2020-07-19T07:00:00.000Z"
      } as unknown as ReservationInput;
      await expect(reservationService.create(reservationInput)).rejects.toThrow(
        'Cannot find record: reservations:: departureDate is not after arrivalDate',
      );
    });
  });

  describe('get()', () => {
    it('Reservation found', async () => {
      const mockReservation = { confirmationNumber: 268469959 };
      mockPouchDbFind.mockReturnValue(
        Promise.resolve({ docs: [mockReservation] }),
      );

      const reservation = await reservationService.get(268469959);

      expect(reservation).toEqual(mockReservation);
      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { confirmationNumber: 268469959 },
      });
      expect(mockTransformReservation).toHaveBeenCalledWith(mockReservation);
    });

    it('Reservation not found', async () => {
      mockPouchDbFind.mockReturnValue(Promise.resolve({ docs: [] }));

      await expect(reservationService.get(123456789)).rejects.toThrow(
        'Cannot find record: reservations::123456789',
      );

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { confirmationNumber: 123456789 },
      });
      expect(mockTransformReservation).not.toHaveBeenCalled();
    });
  });

  describe('getMany()', () => {
    const mockReservations = [
      {
        hotelId: 'DALPAGI',
        status: 'cancelled',
        arrivalDate: '2021-06-16T07:00:00.000Z',  
        departureDate: '2021-06-18T07:00:00.000Z'
      },
      {
        hotelId: 'DALPAGI',
        status: 'inHouse',
        arrivalDate: '2021-07-23T07:00:00.000Z',
        departureDate: '2021-07-25T07:00:00.000Z'
      },
      {
        hotelId: 'DALPAGI',
        status: 'confirmed',
        arrivalDate: '2021-06-19T07:00:00.000Z',
        departureDate: '2021-06-20T07:00:00.000Z'
      },
      {
        hotelId: 'DALPAGI',
        status: 'confirmed',
        arrivalDate: '2021-07-16T07:00:00.000Z',
        departureDate: '2021-07-26T07:00:00.000Z'
      },
      {
        hotelId: 'DALPAGI',
        status: 'confirmed',
        arrivalDate: '2021-05-29T07:00:00.000Z',
        departureDate: '2021-06-29T07:00:00.000Z'
      },
      {
        hotelId: 'DALPAGI',
        status: 'cancelled',
        arrivalDate: '2021-06-16T07:00:00.000Z',
        departureDate: '2021-07-14T07:00:00.000Z'
      },
      {
        hotelId: 'DALPAGI',
        status: 'confirmed',
        arrivalDate: '2021-06-14T07:00:00.000Z',
        departureDate: '2021-07-13T07:00:00.000Z'
      },
      {
        hotelId: 'DALPAGI',
        status: 'inHouse',
        arrivalDate: '2021-06-03T07:00:00.000Z',
        departureDate: '2021-06-17T07:00:00.000Z'
      }
    ];

    it('Found all reservations', async () => {
      mockPouchDbFind.mockReturnValue(
        Promise.resolve({ docs: mockReservations }),
      );

      const reservations = await reservationService.getMany({
        hotelId: "DALPAGI"
      });

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { hotelId: "DALPAGI" },
      });
      expect(reservations.length).toBe(8);
      expect(mockTransformReservation).toHaveBeenCalledTimes(8);
      expect(reservations).toEqual(mockReservations);
    });

    it('Found cancelled reservations', async () => {
      mockPouchDbFind.mockReturnValue(
        Promise.resolve({ docs: mockReservations }),
      );

      const reservations = await reservationService.getMany({
        hotelId: "DALPAGI",
        type: "cancelled"
      });

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { hotelId: "DALPAGI" },
      });
      expect(reservations.length).toBe(2);
      expect(mockTransformReservation).toHaveBeenCalledTimes(2);
      expect(reservations).toEqual([
        {
          hotelId: 'DALPAGI',
          status: 'cancelled',
          arrivalDate: '2021-06-16T07:00:00.000Z',
          departureDate: '2021-06-18T07:00:00.000Z'
        },
        {
          hotelId: 'DALPAGI',
          status: 'cancelled',
          arrivalDate: '2021-06-16T07:00:00.000Z',
          departureDate: '2021-07-14T07:00:00.000Z'
        }
      ]);
    });

    it('Found current reservations', async () => {
      mockPouchDbFind.mockReturnValue(
        Promise.resolve({ docs: mockReservations }),
      );

      const reservations = await reservationService.getMany({
        hotelId: "DALPAGI",
        type: "current"
      });

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { hotelId: "DALPAGI" },
      });
      expect(reservations.length).toBe(1);
      expect(mockTransformReservation).toHaveBeenCalledTimes(1);
      expect(reservations).toEqual([
        {
          hotelId: 'DALPAGI',
          status: 'confirmed',
          arrivalDate: '2021-06-14T07:00:00.000Z',
          departureDate: '2021-07-13T07:00:00.000Z'
        }
      ]);
    });

    it('Found future reservations', async () => {
      mockPouchDbFind.mockReturnValue(
        Promise.resolve({ docs: mockReservations }),
      );

      const reservations = await reservationService.getMany({
        hotelId: "DALPAGI",
        type: "future"
      });

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { hotelId: "DALPAGI" },
      });
      expect(reservations.length).toBe(2);
      expect(mockTransformReservation).toHaveBeenCalledTimes(2);
      expect(reservations).toEqual([
        {
          hotelId: 'DALPAGI',
          status: 'inHouse',
          arrivalDate: '2021-07-23T07:00:00.000Z',
          departureDate: '2021-07-25T07:00:00.000Z'
        },
        {
          hotelId: 'DALPAGI',
          status: 'confirmed',
          arrivalDate: '2021-07-16T07:00:00.000Z',
          departureDate: '2021-07-26T07:00:00.000Z'
        }
      ]);
    });

    it('Found past reservations', async () => {
      mockPouchDbFind.mockReturnValue(
        Promise.resolve({ docs: mockReservations }),
      );

      const reservations = await reservationService.getMany({
        hotelId: "DALPAGI",
        type: "past"
      });

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { hotelId: "DALPAGI" },
      });
      expect(reservations.length).toBe(3);
      expect(mockTransformReservation).toHaveBeenCalledTimes(3);
      expect(reservations).toEqual([
        {
          hotelId: 'DALPAGI',
          status: 'confirmed',
          arrivalDate: '2021-06-19T07:00:00.000Z',
          departureDate: '2021-06-20T07:00:00.000Z'
        },
        {
          hotelId: 'DALPAGI',
          status: 'confirmed',
          arrivalDate: '2021-05-29T07:00:00.000Z',
          departureDate: '2021-06-29T07:00:00.000Z'
        },
        {
          hotelId: 'DALPAGI',
          status: 'inHouse',
          arrivalDate: '2021-06-03T07:00:00.000Z',
          departureDate: '2021-06-17T07:00:00.000Z'
        }
      ]);
    });
  });  
});
