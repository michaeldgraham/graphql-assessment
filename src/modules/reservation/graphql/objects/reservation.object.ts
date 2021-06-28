import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@gql/module/common';
import { Room } from '@gql/module/room-inventory';
import { ReservationStatus } from '@gql/module/reservation';

@ObjectType()
export class Reservation {
  @Field()
  arrivalDate: Date;

  @Field(() => Int)
  confirmationNumber: number;

  @Field()
  departureDate: Date;

  @Field()
  hotelId: string;

  @Field(() => [Room])
  rooms: Room[];

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field()
  user: User;
}
