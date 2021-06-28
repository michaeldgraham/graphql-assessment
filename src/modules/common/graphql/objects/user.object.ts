import { Field, ObjectType } from '@nestjs/graphql';
import { Address, CreditCard, Name } from '@gql/module/common';

@ObjectType()
export class User {
  @Field()
  address: Address;

  @Field()
  creditCard: CreditCard;

  @Field()
  email: string;

  @Field()
  name: Name;
}
