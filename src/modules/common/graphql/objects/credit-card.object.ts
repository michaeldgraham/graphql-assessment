import { Field, ObjectType } from '@nestjs/graphql';
import { CreditCardType } from '@gql/module/common';

@ObjectType()
export class CreditCard {
  @Field()
  cvv: string;

  @Field()
  expirationDate: Date;

  @Field()
  number: string;

  @Field(() => CreditCardType)
  type: CreditCardType;
}
