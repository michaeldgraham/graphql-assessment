import {
  Reservation,
  ReservationInput,
  ReservationStatus,
} from '@gql/module/reservation';
import { Room } from '@gql/module/room-inventory';
import { random } from 'lodash';

export function transformReservationInput(
  reservationInput: ReservationInput,
  rooms: Room[],
): Reservation {
  const confirmationNumber = random(111111111, 999999999);
  return {
    ...reservationInput,
    confirmationNumber,
    rooms,
    status: ReservationStatus.CONFIRMED,
  };
}
