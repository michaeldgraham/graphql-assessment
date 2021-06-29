## SAMPLE CREATE RESERVATION MUTATION

### QUERY:

```graphql
mutation createReservationMutation($input: ReservationInput!) {
  createReservation(input: $input) {
    arrivalDate
    confirmationNumber
    departureDate
    # Removed because Reservation.hotelId is hidden as per Deliverable 2.1 bullet point 2
    # hotelId
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
  "input": {
    "arrivalDate": "2021-10-11",
    "departureDate": "2021-10-15",
    "hotelId": "DALPAGI",
    "rooms": [
      {
        "number": 241
      },
      {
        "number": 324
      }
    ],
    "user": {
      "address": {
        "city": "Dallas",
        "countryCode": "US",
        "postalCode": "75207",
        "stateCode": "TX",
        "street": "2201 N Stemmons"
      },
      "creditCard": {
        "cvv": "123",
        "expirationDate": "2026-09-01",
        "number": "4444 1111 4444 1111",
        "type": "VISA"
      },
      "email": "foo.bar@gmail.com",
      "name": {
        "firstName": "Foo",
        "lastName": "Bar"
      }
    }
  }
}
```
