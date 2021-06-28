import { Reservation, ReservationDocument } from '@gql/module/reservation';

export function transformReservation(
  reservation: ReservationDocument,
): Reservation {
  reservation.arrivalDate = new Date(reservation.arrivalDate);
  reservation.departureDate = new Date(reservation.departureDate);
  reservation.user.creditCard.expirationDate = new Date(
    reservation.user.creditCard.expirationDate,
  );
  return reservation;
}
