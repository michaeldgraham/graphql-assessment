import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { addDays, startOfMonth } from 'date-fns';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

describe('/graphql createReservation() mutation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Successful', async () => {
    const arrivalDate = addDays(new Date(), 10);
    const departureDate = addDays(new Date(), 14);
    const expirationDate = startOfMonth(addDays(new Date(), 1000));

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        query: readFileSync(
          join(__dirname, '__mockdata__', 'createReservationMutation.graphql'),
          'utf8',
        ),
        operationName: 'createReservationMutation',
        variables: {
          input: {
            arrivalDate: arrivalDate.toISOString(),
            departureDate: departureDate.toISOString(),
            hotelId: 'DALPAGI',
            rooms: [
              {
                number: 241,
              },
              {
                number: 324,
              },
            ],
            user: {
              address: {
                city: 'Dallas',
                countryCode: 'US',
                postalCode: '75207',
                stateCode: 'TX',
                street: '2201 N Stemmons',
              },
              creditCard: {
                cvv: '123',
                expirationDate: expirationDate.toISOString(),
                number: '4444 1111 4444 1111',
                type: 'VISA',
              },
              email: 'foo.bar@gmail.com',
              name: {
                firstName: 'Foo',
                lastName: 'Bar',
              },
            },
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.errors).toBeFalsy();
    expect(res.body.data?.createReservation.confirmationNumber).toBeTruthy();
    expect(res.body.data?.createReservation.status).toBe('CONFIRMED');
  });
});
