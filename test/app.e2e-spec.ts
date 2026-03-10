import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function login(username: string, password: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password });

    return response.body.accessToken;
  }

  it('should login admin user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'prosightAdmin111' })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
  });

  it('should reject sideload for normal user', async () => {
    const token = await login('normal', 'prosightNormal222');

    await request(app.getHttpServer())
      .get('/locus?sideload=locusMembers')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should reject forbidden region for limited user', async () => {
    const token = await login('limited', 'prosightLimited333');

    await request(app.getHttpServer())
      .get('/locus?regionId=1')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should allow admin to access locus', async () => {
    const token = await login('admin', 'prosightAdmin111');

    const response = await request(app.getHttpServer())
      .get('/locus?limit=1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
