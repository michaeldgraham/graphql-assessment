import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Address, Coordinate } from '@gql/module/common';
import { HotelStatus } from '@gql/module/hotel';

@ObjectType()
export class Hotel {
  @Field()
  address: Address;

  @Field()
  coordinate: Coordinate;

  @Field()
  currencyCode: string;

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => HotelStatus)
  status: HotelStatus;
}
