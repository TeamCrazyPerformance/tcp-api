import request from 'supertest';
import server from '../../app';
import { generateJwt } from '../../auth';
import { database as DB } from '../../config';

const URL = {
  COMMENT: `/api/articles/1/comments`,
};

const MOCK = {
  comment: { contents: '안녕 난 댓글 테스트' },
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
};

const fakeToken = generateJwt({ id: 1, name: '김테스트' });

describe('POST /comments ', () => {
  const comment = MOCK.comment;
  const token = fakeToken;

  afterAll(async done => {
    const where = { ...comment };
    DB.Comment.findOne({ where })
      .then(comment => comment.destroy({ force: true }))
      .then(done);
  });

  it('댓글을 생성하면 생성된 댓글과 201을 반환한다 ', async () => {
    expect.assertions(1);

    const res = await request(server)
      .post(URL.COMMENT)
      .set('Authorization', token)
      .send({ comment })
      .expect(201);

    expect(res.body).toHaveProperty('comment');
  });

  it('contents 필드가 빠졌을 경우 400을 반환한다 ', async () => {
    await request(server)
      .post(URL.COMMENT)
      .set('Authorization', token)
      .send({ comment: {} })
      .expect(400);
  });
});

describe('PATCH /commments/:commentId', () => {
  let comment, user;
  let token;

  beforeAll(async () => {
    let article = await DB.Article.findByPk(1);
    await DB.User.create(MOCK.user).then(mockUser => {
      user = mockUser;
      token = user.getProfile(true).token;
    });
    await DB.Comment.create(MOCK.comment).then(mockComment => {
      comment = mockComment;
      comment.setUser(user);
      comment.setArticle(article);
    });
  });

  afterAll(async () => {
    await DB.User.findByPk(user.id).then(user => user.destroy({ force: true }));
    await DB.Comment.findByPk(comment.id).then(comment =>
      comment.destroy({ force: true }),
    );
  });

  test('성공시 변경된 코멘트와 205을 받는다', async () => {
    expect.assertions(3);
    const info = { comment: { contents: '와이라노 와이라노' } };
    const { body } = await request(server)
      .patch(`${URL.COMMENT}/${comment.id}`)
      .set('Authorization', token)
      .send(info)
      .expect(205);

    expect(body).toHaveProperty('comment');
    expect(body.comment).toHaveProperty('id');
    expect(body.comment.contents).toBe(info.comment.contents);
  });

  test('내용이 빠졌을 시 400을 받는다', async () => {
    await request(server)
      .patch(`${URL.COMMENT}/${comment.id}`)
      .set('Authorization', token)
      .send({ comment: {} })
      .expect(400);
  });
});

describe('DELETE /comments/:commentId', () => {
  let comment, user;
  let token;

  beforeAll(async () => {
    let article = await DB.Article.findByPk(1);
    await DB.User.create(MOCK.user).then(mockUser => {
      user = mockUser;
      token = user.getProfile(true).token;
    });
    await DB.Comment.create(MOCK.comment).then(mockComment => {
      comment = mockComment;
      comment.setUser(user);
      comment.setArticle(article);
    });
  });

  afterAll(async () => {
    await DB.User.findByPk(user.id).then(user => user.destroy({ force: true }));
  });

  test('삭제할 권한이 없을 경우 403를 받는다', async () => {
    await request(server)
      .delete(`${URL.COMMENT}/${comment.id}`)
      .set('Authorization', fakeToken)
      .expect(403);
  });

  test('성공시 204를 받는다', async () => {
    await request(server)
      .delete(`${URL.COMMENT}/${comment.id}`)
      .set('Authorization', token)
      .expect(204);
  });

  test('존재하지 않는 id를 건넸을 때 404를 받는다 ', async done => {
    await request(server)
      .delete(`${URL.COMMENT}/${comment.id + 'abc'}`)
      .set('Authorization', token)
      .expect(404);

    done();
  });
});
