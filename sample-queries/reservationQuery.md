## SAMPLE RESERVATION QUERY

### QUERY:

```graphql
query reservationQuery($args: ReservationArgs!) {
  reservation(args: $args) {
    arrivalDate
    confirmationNumber
    departureDate
    hotel {
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
    rooms {
      number
      priceAmountAfterTax
      priceAmountBeforeTax
      taxAmount
    }
    status
    user {
      address {
        street
        city
        postalCode
        stateCode
        countryCode
      }
      creditCard {
        cvv
        expirationDate
        number
        type
      }
      email
      name {
        firstName
        lastName
      }
    }
  }
}
```

### VARIABLES:

```json
{
  "args": {
    "confirmationNumber": 268469959
  }
}
```
