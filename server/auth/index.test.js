import request from 'supertest';
import server from '../app';
import { generateJwt } from '../auth';

const URL = {
  ADMIN_USERS: `/api/admin/users`,
};

const adminToken = generateJwt({ id: 1, name: '김테스트', isAdmin: true });
const token = generateJwt({ id: 2, name: '황테스트', isAdmin: false });

describe('adminAuth는 ', () => {
  it('admin일 경우 다음 미들웨어를 실행한다.', async () => {
    expect.assertions(2);

    const res = await request(server)
      .get(URL.ADMIN_USERS)
      .set('Authorization', adminToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('users');
  });

  it('admin이 아닐 경우 403을 반환한다', async () => {
    expect.assertions(2);

    const res = await request(server)
      .get(URL.ADMIN_USERS)
      .set('Authorization', token);

    expect(res.status).toBe(403);
    expect(res.body).not.toHaveProperty('users');
  });
});
