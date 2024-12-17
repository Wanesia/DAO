import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

describe('EnsembleController E2E Test', () => {
  let app: INestApplication;
  let userModel: Model<any>;
  let ensembleModel: Model<any>;
  let accessToken: string;
  let mockUserId: Types.ObjectId;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<any>>(getModelToken('User'));
    ensembleModel = moduleFixture.get<Model<any>>(getModelToken('Ensemble'));

    await app.init();

    const mockUser = {
      _id: new Types.ObjectId(),
      name: 'Test',
      surname: 'User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
    };

    mockUserId = mockUser._id;
    await userModel.create(mockUser);

    accessToken = jwt.sign(
      { userId: mockUserId.toString(), email: mockUser.email },
      process.env.JWT_SECRET || 'testsecret',
    );
  });

  afterAll(async () => {
    await userModel.deleteOne({ _id: mockUserId });
    await ensembleModel.deleteOne({ name: 'Test Ensemble' });
    await app.close();
  });

  it('should create an ensemble without a picture', async () => {
    const mockEnsemble = {
        name: 'Test Ensemble',
        description: 'test test test test',
        homepageUrl: 'https://www.youtube.com/asjdj2k21kdj21j',
        location: {
          city: 'Copenhagen',
          postCode: '1234',
        },
        number_of_musicians: '1-4 musikere',
        practice_frequency: 'Flere gange om ugen',
        genres: ['Barok', 'Romantisk'],
        type: 'Kontinuerligt',
      };
      

      const response = await request(app.getHttpServer())
      .post('/ensembles')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', mockEnsemble.name)
      .field('description', mockEnsemble.description)
      .field('homepageUrl', mockEnsemble.homepageUrl)
      .field('city', mockEnsemble.location.city)
      .field('postcode', mockEnsemble.location.postCode)
      .field('number_of_musicians', mockEnsemble.number_of_musicians)
      .field('practice_frequency', mockEnsemble.practice_frequency)
      .field('genres', JSON.stringify(mockEnsemble.genres))
      .field('type', mockEnsemble.type);
  
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('name', mockEnsemble.name);
    expect(response.body).toHaveProperty('location');
    expect(response.body.location).toMatchObject({
      city: mockEnsemble.location.city,
      postCode: mockEnsemble.location.postCode,
    });
    expect(response.body).toHaveProperty('genres', mockEnsemble.genres);
    expect(response.body).toHaveProperty('creator', mockUserId.toString()); // Use mockUserId
  });
});
