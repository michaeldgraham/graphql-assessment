import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Weather {
  @Field()
  feelsLike: number;

  @Field()
  humidity: number;

  @Field()
  pressure: number;

  @Field()
  temp: number;

  @Field()
  tempMax: number;

  @Field()
  tempMin: number;
}
