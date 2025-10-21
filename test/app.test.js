import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; 
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🧪 Auth & Core Routes Test', () => {
  let token;
  let jobId;
  const testUser = {
    email: 'testuser@example.com',
    password: 'password123',
    phone: '08012345678',
    role: 'recruiter',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should login successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should create a new job', async () => {
    const res = await request(app)
      .post('/api/jobs/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        jobTitle: 'Frontend Developer',
        description: 'React Developer needed',
        jobType: 'remote',
        pricePerHour: 50,
        qualification: 'BSc Computer Science',
        methodOfApplication: 'email',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('job');
    jobId = res.body.job._id;
  });

  it('should fetch jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.jobs)).toBeTruthy();
  });

  it('should logout successfully', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
