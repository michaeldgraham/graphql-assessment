import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Name {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
