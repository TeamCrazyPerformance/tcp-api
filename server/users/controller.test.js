import request from 'supertest';
import server from '../app';
import { generateJwt } from '../auth';
import { database as DB } from '../config';

const [URL, MOCK] = [
  {
    ADMIN_USERS: `/api/admin/users`,
  },
  {
    membership: {
      membership: 'TCP멤버',
    },
    user: {
      grade: 13,
      schoolRegister: '졸업',
      phone: '01012341234',
      birth: '1993/12/12',
      email: 'test@test.com',
      username: '김테스트',
      blog: 'https://test.com',
      avatar:
        'https://avatars3.githubusercontent.com/u/22635168?s=60&u=03100108c279fd31b448dbe222a0d4bfb8d4f58f&v=4',
      githubId: 'test',
      githubUsername: 'test',
    },
  },
];

const adminToken = generateJwt({ id: 1, name: '김테스트', isAdmin: true });

describe('PATCH /admin/users/:userid', () => {
  let user;

  beforeAll(async () => {
    await DB.User.create(MOCK.user).then(mockUser => (user = mockUser));
  });

  afterAll(async () => {
    await user.destroy({ force: true });
  });

  test('성공시 변경된 유저의 정보를 받는다.', async () => {
    expect.assertions(3);

    const { body } = await request(server)
      .patch(`${URL.ADMIN_USERS}/${user.id}`)
      .set('Authorization', adminToken)
      .send(MOCK.membership)
      .expect(200);

    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('membership');
    expect(body.user.membership).toBe('TCP멤버');
  });
});
