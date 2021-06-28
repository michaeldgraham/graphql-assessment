import { Args, Parent, Query, Resolver, ResolveField } from '@nestjs/graphql';
import { Hotel, HotelArgs, HotelService } from '@gql/module/hotel';
import { Weather, WeatherService } from '@gql/module/weather';

@Resolver(() => Hotel)
export class HotelResolver {
  constructor(
    private readonly hotelService: HotelService,
    private readonly weatherService: WeatherService,
  ) {}

  @Query(() => Hotel)
  async hotel(
    @Args('args', { type: () => HotelArgs }) args: HotelArgs,
  ): Promise<Hotel> {
    return this.hotelService.get(args.hotelId);
  }

  @ResolveField(() => Weather, { nullable: true })
  async weather(@Parent() { coordinate }: Hotel): Promise<Weather> {
    return this.weatherService.get(coordinate);
  }
}
