import { registerEnumType } from '@nestjs/graphql';

export enum ReservationType {
  CANCELLED = 'cancelled',
  CURRENT = 'current',
  FUTURE = 'future',
  PAST = 'past',
}

registerEnumType(ReservationType, {
  name: 'ReservationType',
});
