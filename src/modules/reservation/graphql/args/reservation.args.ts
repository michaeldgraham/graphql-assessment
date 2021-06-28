import { Field, InputType, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@InputType()
export class ReservationArgs {
  @Field(() => Int)
  @IsPositive()
  confirmationNumber: number;
}
