import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Adam',
        surname: 'Kowal',
        email: 'kowal@gmail.com',
        password: 'password123',
      }).expect(201);
  });
});
