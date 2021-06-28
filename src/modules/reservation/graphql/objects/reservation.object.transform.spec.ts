import { addDays, startOfMonth } from 'date-fns';
import { Reservation, ReservationDocument } from '@gql/module/reservation';
import { transformReservation } from './reservation.object.transform';

test('transformReservation()', () => {
  const arrivalDate = addDays(new Date(), 10);
  const departureDate = addDays(new Date(), 14);
  const expirationDate = startOfMonth(addDays(new Date(), 1000));

  const expectedReservation: Reservation = {
    confirmationNumber: 123456789,
    arrivalDate,
    departureDate,
    user: {
      creditCard: {
        expirationDate,
      },
    },
  } as unknown as Reservation;

  const reservationDoc: ReservationDocument = {
    confirmationNumber: 123456789,
    arrivalDate: arrivalDate.toISOString(),
    departureDate: departureDate.toISOString(),
    user: {
      creditCard: {
        expirationDate: expirationDate.toISOString(),
      },
    },
  } as unknown as ReservationDocument;

  const reservation = transformReservation(reservationDoc);
  expect(reservation).toEqual(expectedReservation);
});
