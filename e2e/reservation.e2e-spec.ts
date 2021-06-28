import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

describe('/graphql reservation() query', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Reservation found', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: readFileSync(
          join(__dirname, '__mockdata__', 'reservationQuery.graphql'),
          'utf8',
        ),
        operationName: 'reservationQuery',
        variables: {
          args: {
            confirmationNumber: 268469959,
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.errors).toBeFalsy();
    expect(res.body.data?.reservation.confirmationNumber).toBe(268469959);
  });

  it('Reservation not found', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: readFileSync(
          join(__dirname, '__mockdata__', 'reservationQuery.graphql'),
          'utf8',
        ),
        operationName: 'reservationQuery',
        variables: {
          args: {
            confirmationNumber: 123456789,
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeFalsy();
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors[0].message).toBe(
      'Cannot find record: reservations::123456789',
    );
  });
});
