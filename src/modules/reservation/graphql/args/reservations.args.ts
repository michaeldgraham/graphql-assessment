import { InputType, Field } from '@nestjs/graphql';
import { ReservationType } from '@gql/module/reservation';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class ReservationsArgs {
  @Field()
  @Length(7, 7)
  hotelId: string;

  @Field(() => ReservationType, { nullable: true })
  @IsOptional()
  type: ReservationType;
}
