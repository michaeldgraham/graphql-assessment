import { Field, InputType } from '@nestjs/graphql';
import { AddressInput, CreditCardInput, NameInput } from '@gql/module/common';
import { IsEmail } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  address: AddressInput;

  @Field()
  creditCard: CreditCardInput;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  name: NameInput;
}
