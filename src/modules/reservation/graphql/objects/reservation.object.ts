import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@gql/module/common';
import { Room } from '@gql/module/room-inventory';
import { ReservationStatus } from '@gql/module/reservation';
import { Hotel } from '@gql/module/hotel';

@ObjectType()
export class Reservation {
  @Field()
  arrivalDate: Date;

  @Field(() => Int)
  confirmationNumber: number;

  @Field()
  departureDate: Date;

  @HideField()
  hotelId: string;

  @Field(() => [Room])
  rooms: Room[];

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field()
  user: User;

  @Field(() => Hotel)
  hotel?: Hotel;

}
