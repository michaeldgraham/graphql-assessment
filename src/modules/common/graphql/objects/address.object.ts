import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Address {
  @Field()
  city: string;

  @Field()
  countryCode: string;

  @Field({ nullable: true })
  postalCode: string;

  @Field({ nullable: true })
  stateCode?: string;

  @Field()
  street: string;
}
