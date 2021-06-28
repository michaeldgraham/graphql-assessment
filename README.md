## Description

For this GraphQL code assessment, we expect you to make the changes listed in the `Deliverables` sections and then email us the link to your CodeSandbox instance that has your changes. (As soon as you make a change and save it, it will fork this project and create a unique URL for you).

If you prefer to work in your code editor of choice, you can export this sandbox as a zip (File -> Export to Zip), and then you can then import it into CodeSandbox after completion (https://codesandbox.io/docs/importing). In the end, still email us the link to your CodeSandbox instance that has your changes.

## Installation

```bash
$ yarn
```

**NOTE**: If developing in CodeSandbox, you won't need to run the installation step.

## Running the app

```bash
$ yarn start
```

**NOTE**: If developing in CodeSandbox, you won't need to run the command to start/restart the application.

## Running unit tests

To run all the unit tests:

```bash
$ yarn test
```

To run a specific unit test:

```bash
$ yarn test <path to spec file>
```

**NOTE**: If developing in CodeSandbox, you will need to open a new terminal to run the command.

## Running e2e tests

To run all the e2e tests:

```bash
$ yarn test:e2e
```

To run a specific e2e test:

```bash
$ yarn test:e2e <path to e2e-spec file>
```

**NOTE**: If developing in CodeSandbox, you will need to open a new terminal to run the command.

## Deliverables

This project is a sample GraphQL service that contains functionality to retrieve hotel information, along with the ability to create and retrieve reservation information.

Please complete the deliverables mentioned below, and once done ensure that the linting and tests are successful. And feel free to add code comments along the way with assumptions, or known compromises in how you approached the work.

### Deliverable # 1

The acceptance criteria of this deliverable is to be able to return current weather data of a hotel.

1. Implement `WeatherService.get()` to retrieve main weather details based on a coordinate.

   - Use the openweathermap.org API (https://openweathermap.org/current#geo) to retrieve weather data, with the app id of `b07c6aae9638d6fea029603bf5d20c78`.

     **Sample request**:

     ```bash
     curl --request GET \
     --url 'http://api.openweathermap.org/data/2.5/weather?appid=b07c6aae9638d6fea029603bf5d20c78&lat=30.2672&lon=97.7431' \
     --header 'Accept: application/json'
     ```

     **Sample response**:

     ```json
     {
       "coord": {
         "lon": 97.7431,
         "lat": 30.2672
       },
       "weather": [
         {
           "id": 804,
           "main": "Clouds",
           "description": "overcast clouds",
           "icon": "04n"
         }
       ],
       "base": "stations",
       "main": {
         "temp": 277.65,
         "feels_like": 275.61,
         "temp_min": 277.65,
         "temp_max": 277.65,
         "pressure": 1014,
         "humidity": 96
       },
       "visibility": 46,
       "wind": {
         "speed": 2.33,
         "deg": 346,
         "gust": 2.23
       },
       "clouds": {
         "all": 100
       },
       "dt": 1622378702,
       "sys": {
         "country": "CN",
         "sunrise": 1622327314,
         "sunset": 1622377492
       },
       "timezone": 28800,
       "id": 1279592,
       "name": "Yanduo",
       "cod": 200
     }
     ```

   **NOTE**: The ./src/modules/weather/models/weather.transform.ts transformer is already provided to convert the weather response body to conform to the GraphQL `Weather` schema.

2. Write a `WeatherService.get()` unit test.
3. Update the hotel e2e test (./e2e/hotel.e2e-spec.ts) to query for `Hotel.weather`.
4. After the deliverable is complete, you should be able to execute this hotel sample query within GraphQL Playground: ./sample-queries/hotelQuery.md

### Deliverable # 2

The acceptance criteria of this deliverable is to return full details of a hotel associated to a reservation.

1. Add a `Reservation.hotel` field:

   ```graphql
   type Reservation {
     ... exiting fields ...
     hotel: Hotel!
   }
   ```

   - Resolve the hotel using the value of `Reservation.hotelId`.
   - Hide the `Reservation.hotelId` field from the generated GraphQL schema.

2. Update the reservation (./e2e/reservation.e2e-spec.ts) and createReservation (./e2e/createReservation.e2e-spec.ts) e2e tests to query for `Reservation.hotel`.
3. After the deliverable is complete, you should be able to execute this reservation sample query within GraphQL Playground: ./sample-queries/reservationQuery.md

### Deliverable # 3

The acceptance criteria of this deliverable is to perform additional custom validation when creating a reservation to verify that the date input provided is valid.

1. Update the `ReservationService.create()` function to perform these validations:
   - Verify that the arrivalDate is >= current date
   - Verify that the departureDate is > arrivalDate
2. Update the `ReservationService.create()` unit tests.
3. To manually test, you should be able to execute this reservation sample query within GraphQL Playground: ./sample-queries/createReservationMutation.md

### Deliverable # 4

The acceptance criteria of this deliverable is to create a query to retrieve all reservations with the ability to filter based on:

- A hotel id
- Either by cancelled, current, future, or past reservations

1. Add a `reservations()` query with the following schema:

   ```graphql
   type Query {
      ... existing fields ...
      reservations(args: ReservationsArgs!): [Reservation!]!
   }

   input ReservationsArgs {
      hotelId: String!
      type: ReservationType
   }

   enum ReservationType {
      CANCELLED
      CURRENT
      FUTURE
      PAST
   }
   ```

   **NOTE**: The `ReservationsArgs` and `ReservationType` GraphQL types have already been defined.

2. Add a `ReservationService.getMany()` function that performs the following:
   - Filter and return reservations where `Reservation.hotelId` matches the hotel id argument provided.
   - If the `type` argument is provided, filter and return reservations based on the rules associated to each type:
     | TYPE | RULE |
     | ---- | ---- |
     | CANCELLED | `Reservation.status` = `cancelled` |
     | CURRENT | `Reservation.status` != `cancelled` AND `Reservation.arrivalDate` <= current date AND `Reservation.departureDate` >= current date |
     | FUTURE | `Reservation.status` != `cancelled` AND `Reservation.arrivalDate` >= current date |
     | PAST | `Reservation.status` != `cancelled` AND `Reservation.departureDate` < current date |
3. Write a `ReservationService.getMany()` unit test.
4. Create an e2e test for the `reservations()` query.
5. After the deliverable is complete, you should be able to execute this reservation sample query within GraphQL Playground: ./sample-queries/reservationsQuery.md

### Deliverable # 5

Review the codebase and provide thoughts or opinions you may have on how to improve any part of the codebase.
