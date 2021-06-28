import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class NameInput {
  @Field()
  @Length(3, 30)
  firstName: string;

  @Field()
  @Length(3, 30)
  lastName: string;
}
