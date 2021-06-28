## SAMPLE HOTEL QUERY

### QUERY:

```graphql
query hotelQuery($args: HotelArgs!) {
  hotel(args: $args) {
    address {
      street
      city
      postalCode
      stateCode
      countryCode
    }
    coordinate {
      latitude
      longitude
    }
    currencyCode
    id
    name
    status
    weather {
      feelsLike
      humidity
      pressure
      temp
      tempMax
      tempMin
    }
  }
}
```

### VARIABLES:

```json
{
  "args": {
    "hotelId": "DALPPHX"
  }
}
```
