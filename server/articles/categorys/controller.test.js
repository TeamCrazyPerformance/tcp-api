import request from 'supertest';
import server from '../../app';
import { generateJwt } from '../../auth';
import { database as DB } from '../../config';

const URL = {
  CATEGORYS: `/api/categories`,
};

const token = generateJwt({ id: 1, name: '김테스트', isAdmin: true });

describe('GET /categories ', () => {
  it('GET /categories 카테고리 목록을 반환한다', async () => {
    const res = await request(server).get(URL.CATEGORYS);

    expect(res.body).toHaveProperty('categories');
  });
});

describe('POST /categories ', () => {
  let category;

  beforeEach(() => {
    category = { name: '김카테고리', parent: 1 };
  });

  afterAll(async done => {
    const where = { ...category };
    DB.Category.findOne({ where })
      .then(category => category.destroy({ force: true }))
      .then(done);
  });

  it('카테고리를 생성하면 생성된 카테고리와 201을 반환한다 ', async () => {
    const res = await request(server)
      .post(URL.CATEGORYS)
      .set('Authorization', token)
      .send({ category })
      .expect(201);

    expect(res.body).toHaveProperty('category');
  });

  it('이미 존재하는 카테고리일 경우 409를 반환한다', async () => {
    await request(server)
      .post(URL.CATEGORYS)
      .set('Authorization', token)
      .send({ category });

    await request(server)
      .post(URL.CATEGORYS)
      .set('Authorization', token)
      .send({ category })
      .expect(409);
  });

  it('name 필드가 빠졌을 경우 400을 반환한다 ', async () => {
    await request(server)
      .post(URL.CATEGORYS)
      .set('Authorization', token)
      .send({ category: {} })
      .expect(400);
  });
});

describe('PATCH /categories/:categoryId', () => {
  let category = { name: '박카테고리', parent: 1 };
  let cateogryId;

  beforeAll(async () => {
    await DB.Category.create(category).then(
      category => (cateogryId = category.id),
    );
  });

  afterAll(async () => {
    await DB.Category.findByPk(cateogryId).then(category =>
      category.destroy({ force: true }),
    );
  });

  test('성공시 변경된 카테고리와 200을 받는다', async () => {
    await request(server)
      .patch(`${URL.CATEGORYS}/${cateogryId}`)
      .set('Authorization', token)
      .send({ category: { name: '노드최고', parent: 1 } })
      .expect(200)
      .then(res => expect(res.body).toHaveProperty('category'));
  });

  test('항목이 빠졌을 시 400을 받는다', async () => {
    await request(server)
      .patch(`${URL.CATEGORYS}/${cateogryId}`)
      .set('Authorization', token)
      .send({ category: {} })
      .expect(400);
  });

  test('파라미터에 카테고리 아이디가 없을 시 404을 받는다', async () => {
    await request(server)
      .patch(`${URL.CATEGORYS}`)
      .set('Authorization', token)
      .send({ category })
      .expect(404);
  });
});

describe('DELETE /categories/:categoryId', () => {
  let category = { name: '안녕카테고리', parent: 1 };
  let cateogryId;

  beforeAll(async () => {
    await DB.Category.create(category).then(
      category => (cateogryId = category.id),
    );
  });

  test('성공시 204를 받는다', async () => {
    await request(server)
      .delete(`${URL.CATEGORYS}/${cateogryId}`)
      .set('Authorization', token)
      .expect(204);
  });

  test('존재하지 않는 id를 건넸을 때 404를 받는다 ', async done => {
    await request(server)
      .delete(`${URL.CATEGORYS}/${cateogryId + 'abc'}`)
      .set('Authorization', token)
      .expect(404);

    done();
  });
});
