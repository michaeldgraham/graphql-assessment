import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coordinate {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
