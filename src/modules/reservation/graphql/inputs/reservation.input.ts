import { Field, InputType } from '@nestjs/graphql';
import { RoomInput } from '@gql/module/room-inventory';
import { UserInput } from '@gql/module/common';
import { Length, IsDate } from 'class-validator';

@InputType()
export class ReservationInput {
  @Field()
  @IsDate()
  arrivalDate: Date;

  @Field()
  @IsDate()
  departureDate: Date;

  @Field()
  @Length(7, 7)
  hotelId: string;

  @Field(() => [RoomInput])
  rooms: RoomInput[];

  @Field()
  user: UserInput;
}
