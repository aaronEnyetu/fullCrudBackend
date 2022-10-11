const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  // firstName: 'Test',
  // lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('#POST /api/v1/lists/ should create a new item entry', async () => {
    const [agent, user] = await registerAndLogin();
    const item = { description: 'laundry' };
    const res = await agent.post('/api/v1/lists').send(item);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      description: item.description,
      user_id: user.id,
      completed: false,
    });
  });

  it('#GET /api/v1/lists shows a list of all items for the auth user', async () => {
    const [agent, user] = await registerAndLogin();
    const item = { description: 'laptop' };
    const res = await agent.post('/api/v1/lists').send(item);
    expect(res.status).toBe(200);

    const resp = await agent.get('/api/v1/lists');
    expect(resp.body.length).toBe(1);
    expect(resp.body[0]).toEqual({
      id: expect.any(String),
      description: 'laptop',
      user_id: user.id,
      completed: false,
    });
  });

  //   it('#PUT /api/v1/lists/:id allows an auth user to complete a purchase', async () => {
  //     const [agent, user] = await registerAndLogin();
  //     const item = { description: 'laptop' };
  //     const res = await agent.post('/api/v1/lists').send(item);
  //     expect(res.status).toBe(200);

  //     const resp = await agent.put('/api/v1/lists/1').send({ completed: true });
  //     expect(resp.status).toBe(200);
  //     expect(resp.body).toEqual({
  //       id: expect.any(String),
  //       description: 'laptop',
  //       user_id: user.id,
  //       completed: true,
  //     });
  //   });

  //   it('#DELETE /api/v1/lists/:id user can delete an item', async () => {
  //     const item = { description: 'laptop' };
  //     const agent = request.agent(app);
  //     await agent.post('/api/v1/users').send(mockUser);

  //     const response = await agent.post('/api/v1/lists').send(item);
  //     expect(response.status).toBe(200);

  //     const res = await agent.delete('/api/v1/lists/1');
  //     expect(res.status).toBe(200);

  //     const resp = await agent.get('/api/v1/lists/1');
  //     expect(resp.status).toBe(404);
  //   });
});
