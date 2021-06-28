import { Hotel } from '@gql/module/hotel';

export interface HotelDocument extends Omit<Hotel, 'weather'> {
  _id: string;
}
