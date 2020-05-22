import request from 'supertest';
import server from '../../app';
import { generateJwt } from '../../auth';
import { database as DB } from '../../config';

const URL = {
  NOTICES: `/api/admin/notices`,
};

const MOCK = {
  article: { title: '공지야', contents: '안녕 난 공지 테스트' },
};

const token = generateJwt({ id: 1, name: '김테스트', isAdmin: true });

describe('POST /notices ', () => {
  let notice, article;

  beforeAll(async () => {
    article = await DB.Article.create(MOCK.article);
    notice = { type: '전체', articleId: article.id };
  });

  afterAll(async done => {
    const where = { articleId: article.id };
    await DB.Notice.findOne({ where }).then(notice =>
      notice.destroy({ force: true }),
    );

    await article.destroy({ force: true });
    done();
  });

  it('공지를 생성하면 201을 반환한다. ', async () => {
    const res = await request(server)
      .post(URL.NOTICES)
      .set('Authorization', token)
      .send({ notice });

    expect(res.status).toBe(201);
  });
});

describe('DELETE /notices/:noticeId', () => {
  let notice, article;

  afterAll(async done => {
    await notice.destroy({ force: true });
    await article.destroy({ force: true });
    done();
  });

  test('성공시 200을 받는다', async () => {
    article = await DB.Article.create(MOCK.article);
    notice = await DB.Notice.create({ type: 1, articleId: article.id });

    const res = await request(server)
      .delete(`${URL.NOTICES}/${notice.id}`)
      .set('Authorization', token);

    expect(res.status).toBe(204);
  });
});
