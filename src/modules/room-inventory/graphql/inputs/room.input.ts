import { Field, InputType } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@InputType()
export class RoomInput {
  @Field()
  @IsPositive()
  number: number;
}
