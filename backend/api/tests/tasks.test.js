const request = require('supertest');
const app = require('../../app');
const { User,Task } = require('../../models'); 
const jwt = require('jsonwebtoken');
const { email } = require('envalid');

let token;
  

beforeAll(async () => {
  await Task.destroy({ where: {} });
  await User.destroy({ where: {} });
  try {
    const createdUser = await User.create({
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'testpassword',
    });
    token = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET || 'testsecret');
  } catch (err) {
    console.error('Sequelize create error:', err);
  }
});
describe('Task API Endpoints', () => {
  let createdTaskId;

  test('POST /tasks - create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'Test description',
        status: 'To-Do',
        estimate_hours: 0,
        logged_hours: 0,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdTaskId = res.body.id;
  });

  test('GET /tasks - fetch all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /tasks/:id - fetch one task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Task');
  });

  test('PATCH /tasks/:id - update task', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'To-Do' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('To-Do');
  });

  test('POST /tasks/:id/log-time - add hours', async () => {
    const res = await request(app)
      .post(`/api/tasks/${createdTaskId}/log-time`)
      .set('Authorization', `Bearer ${token}`)
      .send({ hours: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body.total_logged_hours).toBeGreaterThanOrEqual(1);
  });

  test('PUT /tasks/:id/update-time - update estimated/logged', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}/update-time`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estimate_hours: 5, logged_hours: 3 });

    expect(res.statusCode).toBe(200);
    expect(Number(res.body.estimate_hours)).toBe(5);
    expect(Number(res.body.logged_hours)).toBe(3);
  });

  test('PUT /tasks/:id/update-time - reject negative hours', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}/update-time`)
      .send({ estimate_hours: -5 });
    console.log('Response:', res.statusCode, res.body);
    expect(res.statusCode).toBe(400);
});

  test('DELETE /tasks/:id - delete task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });


});
