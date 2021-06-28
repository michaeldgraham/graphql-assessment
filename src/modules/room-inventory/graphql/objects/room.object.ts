import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @HideField()
  hotelId: string;

  @Field()
  number: number;

  @Field()
  priceAmountAfterTax: number;

  @Field()
  priceAmountBeforeTax: number;

  @Field()
  taxAmount: number;
}
