import { Parent, Args, Mutation, Query, Resolver, ResolveField } from '@nestjs/graphql';
import { Hotel, HotelService } from '@gql/module/hotel';
import {
  Reservation,
  ReservationArgs,
  ReservationsArgs,
  ReservationInput,
  ReservationService,
} from '@gql/module/reservation';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(
    private readonly hotelService: HotelService,
    private readonly reservationService: ReservationService,
  ) {}

  @Mutation(() => Reservation)
  async createReservation(
    @Args('input', { type: () => ReservationInput }) input: ReservationInput,
  ): Promise<Reservation> {
    return this.reservationService.create(input);
  }

  @Query(() => Reservation)
  async reservation(
    @Args('args', { type: () => ReservationArgs }) args: ReservationArgs,
  ): Promise<Reservation> {
    return this.reservationService.get(args.confirmationNumber);
  }

  @Query(() => [Reservation])
  async reservations(
    @Args('args', { type: () => ReservationsArgs }) args: ReservationsArgs,
  ): Promise<Reservation[]> {
    return this.reservationService.getMany(args);
  }

  @ResolveField(() => Reservation)
  async hotel(@Parent() { hotelId }: Reservation): Promise<Hotel> {
    return this.hotelService.get(hotelId);
  }
}
