import { Room } from '@gql/module/room-inventory';

export interface RoomDocument extends Room {
  _id: string;
}
