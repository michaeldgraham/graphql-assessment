import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class HotelArgs {
  @Field()
  @Length(7, 7)
  hotelId: string;
}
