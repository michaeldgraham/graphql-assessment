import { registerEnumType } from '@nestjs/graphql';

export enum HotelStatus {
  CLOSED = 'C',
  OPEN = 'O',
  PRE_OPEN = 'P',
  UNDER_CONSTRUCTION = 'U',
}

registerEnumType(HotelStatus, {
  name: 'HotelStatus',
});
