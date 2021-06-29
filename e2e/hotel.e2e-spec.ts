import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

describe('/graphql hotel() query', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Hotel found', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: readFileSync(
          join(__dirname, '__mockdata__', 'hotelQuery.graphql'),
          'utf8',
        ),
        operationName: 'hotelQuery',
        variables: {
          args: {
            hotelId: 'DALPPHX',
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.errors).toBeFalsy();
    expect(res.body.data?.hotel.id).toBe('DALPPHX');
    expect(res.body.data?.hotel.weather).toEqual({
      "feelsLike": expect.any(Number),
      "humidity": expect.any(Number),
      "pressure": expect.any(Number),
      "temp": expect.any(Number),
      "tempMax": expect.any(Number),
      "tempMin": expect.any(Number)
    });
  });

  it('Hotel not found', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: readFileSync(
          join(__dirname, '__mockdata__', 'hotelQuery.graphql'),
          'utf8',
        ),
        operationName: 'hotelQuery',
        variables: {
          args: {
            hotelId: 'XXXXXXX',
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeFalsy();
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors[0].message).toBe(
      'Cannot find record: hotels::XXXXXXX',
    );
  });
});
