import request from 'supertest';
import server from '../app';
import { generateJwt } from '../auth';
import { database as DB } from '../config';

const URL = {
  ARTICLE: `/api/articles`,
};

const MOCK = {
  article: { title: 'test', contents: '안녕 난 게시글 테스트' },
  category: 1,
};

const token = generateJwt({ id: 1, name: '김테스트' });
const adminToken = generateJwt({ id: 3, name: '김테스트', isAdmin: true });

describe('POST /articles ', () => {
  afterAll(async done => {
    const where = MOCK.article;
    DB.Article.findOne({ where })
      .then(article => article.destroy({ force: true }))
      .then(done);
  });

  it('게시글을 생성하면 생성된 게시글과 201을 반환한다 ', async () => {
    expect.assertions(2);

    const res = await request(server)
      .post(URL.ARTICLE)
      .set('Authorization', token)
      .send(MOCK);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('article');
  });

  it('title, contents, 카테고리 필드가 빠졌을 경우 400을 반환한다 ', async () => {
    expect.assertions(3);

    const res1 = await request(server)
      .post(URL.ARTICLE)
      .set('Authorization', token)
      .send({ article: { title: '안녕 ' }, category: 2 });

    const res2 = await request(server)
      .post(URL.ARTICLE)
      .set('Authorization', token)
      .send({ article: { contents: '안녕 ' }, category: 2 });

    const res3 = await request(server)
      .post(URL.ARTICLE)
      .set('Authorization', token)
      .send({ article: { contents: '안녕 ' } });

    expect(res1.status).toBe(400);
    expect(res2.status).toBe(400);
    expect(res3.status).toBe(400);
  });

  it('잘못된 카테고리를 전송한 경우 400를 반환한다', async () => {
    expect.assertions(1);

    const res = await request(server)
      .post(URL.ARTICLE)
      .set('Authorization', token)
      .send({
        article: { title: '안녕 ', contents: 'asdasdasd' },
        category: 93124,
      });

    expect(res.status).toBe(400);
  });
});

describe('GET /articles?category=name ', () => {
  it('해당 카테고리의 게시글과 공지를 반환한다 ', async done => {
    expect.assertions(4);

    const res = await request(server)
      .get(`${URL.ARTICLE}?category=1`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('articles');
    expect(res.body).toHaveProperty('articlesCount');
    expect(res.body).toHaveProperty('notices');

    done();
  });
});

describe('DELETE /articles/:articleId ', () => {
  let article;

  beforeAll(async () => {
    article = await DB.Article.create({ author: 2, ...MOCK.article });
  });

  afterAll(async () => {
    await article.destroy({ force: true });
  });

  it('내가 쓴 글이 아닌 경우 403을 받는다 ', async done => {
    const res = await request(server)
      .delete(`${URL.ARTICLE}/${article.id}`)
      .set('Authorization', token);

    expect(res.status).toBe(403);

    done();
  });

  it('관리자의 경우 삭제 가능하다. 204를 받는다. ', async done => {
    const res = await request(server)
      .delete(`${URL.ARTICLE}/${article.id}`)
      .set('Authorization', adminToken);

    expect(res.status).toBe(204);

    done();
  });
});
