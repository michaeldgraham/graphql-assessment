import { Field, InputType } from '@nestjs/graphql';
import { Length, IsOptional } from 'class-validator';

@InputType()
export class AddressInput {
  @Field()
  city: string;

  @Field()
  @Length(2, 2)
  countryCode: string;

  @Field({ nullable: true })
  postalCode: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(2, 3)
  stateCode?: string;

  @Field()
  street: string;
}
