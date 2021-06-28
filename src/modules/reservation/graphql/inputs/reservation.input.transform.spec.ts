import { addDays } from 'date-fns';
import { CreditCardType } from '@gql/module/common';
import {
  Reservation,
  ReservationInput,
  ReservationStatus,
} from '@gql/module/reservation';
import { Room } from '@gql/module/room-inventory';
import { transformReservationInput } from './reservation.input.transform';

jest.mock('lodash', () => ({ random: () => 123456789 }));

test('transformReservationInput()', () => {
  const arrivalDate = addDays(new Date(), 10);
  const departureDate = addDays(new Date(), 14);
  const expirationDate = addDays(new Date(), 100);

  const reservationInput: ReservationInput = {
    arrivalDate,
    departureDate,
    hotelId: 'DALPAGI',
    rooms: [{ number: 241 }, { number: 324 }],
    user: {
      address: {
        city: 'Dallas',
        countryCode: 'US',
        postalCode: '75207',
        stateCode: 'TX',
        street: '2201 N Stemmons',
      },
      creditCard: {
        cvv: '123',
        expirationDate: expirationDate,
        number: '4444 1111 4444 1111',
        type: CreditCardType.VISA,
      },
      email: 'foo.bar@gmail.com',
      name: {
        firstName: 'Foo',
        lastName: 'Bar',
      },
    },
  };

  const rooms: Room[] = [
    {
      hotelId: 'DALPAGI',
      number: 241,
      priceAmountAfterTax: 115.54,
      priceAmountBeforeTax: 106,
      taxAmount: 9.54,
    },
    {
      hotelId: 'DALPAGI',
      number: 324,
      priceAmountAfterTax: 187.48,
      priceAmountBeforeTax: 172,
      taxAmount: 15.48,
    },
  ];

  const expectedReservation: Reservation = {
    ...reservationInput,
    confirmationNumber: 123456789,
    rooms,
    status: ReservationStatus.CONFIRMED,
  };

  const reservation = transformReservationInput(reservationInput, rooms);
  expect(reservation).toEqual(expectedReservation);
});
