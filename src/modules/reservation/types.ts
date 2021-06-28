import { Reservation } from '@gql/module/reservation';

export interface ReservationDocument extends Omit<Reservation, 'hotel'> {
  _id: string;
}
