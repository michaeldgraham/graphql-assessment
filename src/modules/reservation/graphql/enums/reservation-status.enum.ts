import { registerEnumType } from '@nestjs/graphql';

export enum ReservationStatus {
  CANCELLED = 'cancelled',
  CHECKED_IN = 'checkedIn',
  CHECKED_OUT = 'checkedOut',
  CONFIRMED = 'confirmed',
  IN_HOUSE = 'inHouse',
}

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
});
