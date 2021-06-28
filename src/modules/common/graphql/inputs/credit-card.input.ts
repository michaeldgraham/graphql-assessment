import { Field, InputType } from '@nestjs/graphql';
import { CreditCardType } from '@gql/module/common';
import { Length, IsDate, IsCreditCard, IsNumberString } from 'class-validator';

@InputType()
export class CreditCardInput {
  @Field()
  @Length(3, 3)
  @IsNumberString()
  cvv: string;

  @Field()
  @IsDate()
  expirationDate: Date;

  @Field()
  @IsCreditCard()
  number: string;

  @Field(() => CreditCardType)
  type: CreditCardType;
}
