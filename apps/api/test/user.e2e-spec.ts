import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';

describe('UserController E2E Test', () => {
  let app: INestApplication;
  let userModel: Model<any>;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<any>>(getModelToken('User'));

    await app.init();
  });

  beforeEach(async () => {
    // Reset user instruments before each test
    await userModel.updateOne(
      { email: userData.email },
      { $set: { instruments: [] } },
    );
  });

  afterAll(async () => {
    await userModel.deleteOne({ email: userData.email }); // Clean up after the test
    await app.close();
  });

  const userData = {
    name: 'Adam',
    surname: 'Kowal',
    email: 'kowal@gmail.com',
    password: 'password123',
  };

  const instrumentData = {
    name: 'Violin',
    level: 1,
    genres: ['Barok', 'Romantisk'],
  };

  it('should create a new user with hashed password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    // Check the response contains necessary user data
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('email', userData.email);
    expect(response.body).toHaveProperty('name', userData.name);
    expect(response.body).toHaveProperty('surname', userData.surname);

    // Find the user in the database
    const createdUser = await userModel.findOne({ email: userData.email });

    // Ensure the password is hashed and not the plain-text password
    const isPasswordHashed = await bcrypt.compare(
      userData.password,
      createdUser.password,
    );

    expect(isPasswordHashed).toBe(true);
    expect(createdUser.password).not.toBe(userData.password);
  });

  it('should login successfully with valid credentials', async () => {
    // Log in with correct credentials
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(201);
    expect(response.body).toHaveProperty('accessToken');
    accessToken = response.body.accessToken;
  });

  it('should fail to access protected route (profile) without token', async () => {
    await request(app.getHttpServer()).get('/users/profile').expect(401);
  });

  it('should fail to access protected route (profile) with invalid token', async () => {
    await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);
  });

  it('should successfully access protected route (profile) with valid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Verify profile details
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('email', userData.email);
    expect(response.body).toHaveProperty('name', userData.name);
    expect(response.body).toHaveProperty('surname', userData.surname);

    // Ensure sensitive fields are not returned
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('__v');
  });
  describe('Add Instrument', () => {
    it('should add an instrument to user successfully', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/instruments/${userData.email}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(instrumentData)
        .expect(200);

      // Verify the response
      expect(response.body).toHaveProperty('instruments');
      expect(response.body.instruments).toHaveLength(1);
      expect(response.body.instruments[0]).toMatchObject(instrumentData);
    });

    it('should fail to add instrument without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/users/instruments/${userData.email}`)
        .send(instrumentData)
        .expect(401);
    });

    it('should fail to add instrument to non-existent user', async () => {
      await request(app.getHttpServer())
        .patch('/users/instruments/nonexistent@example.com')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(instrumentData)
        .expect(404);
    });
  });

  describe('Delete Instrument', () => {
    beforeEach(async () => {
      // Add an instrument before each delete test
      await request(app.getHttpServer())
        .patch(`/users/instruments/${userData.email}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(instrumentData)
        .expect(200);
    });

    it('should delete an instrument successfully', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userData.email}/instruments/delete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ index: 0 })
        .expect(200);
      // Verify the response
      expect(response.body).toHaveProperty('instruments');
      expect(response.body.instruments).toHaveLength(0);
    });

    it('should fail to delete instrument without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${userData.email}/instruments/delete`)
        .send({ index: 0 })
        .expect(401);
    });

    it('should fail to delete instrument with invalid index', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${userData.email}/instruments/delete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ index: 999 }) // Out of bounds index
        .expect(400);
    });
  });

  describe('Multiple Instrument Operations', () => {
    it('should add multiple instruments and delete specific one', async () => {
      const instrument1 = { name: 'Theorbo', level: 2, genres: ['Barok'] };
      const instrument2 = {
        name: 'Trumpet',
        level: 3,
        genres: ['Barok', 'Romantisk', 'Symfonisk'],
      };

      // Add first instrument
      await request(app.getHttpServer())
        .patch(`/users/instruments/${userData.email}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(instrument1)
        .expect(200);

      // Add second instrument
      await request(app.getHttpServer())
        .patch(`/users/instruments/${userData.email}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(instrument2)
        .expect(200);

      // Delete first instrument (index 0)
      const response = await request(app.getHttpServer())
        .patch(`/users/${userData.email}/instruments/delete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ index: 0 })
        .expect(200);

      // Verify only second instrument remains
      expect(response.body).toHaveProperty('instruments');
      expect(response.body.instruments).toHaveLength(1);
      expect(response.body.instruments[0]).toMatchObject(instrument2);
    });
  });
});
