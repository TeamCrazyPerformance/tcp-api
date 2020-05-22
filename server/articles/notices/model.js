import { DataTypes } from 'sequelize';

const type = {
  1: '전체',
  2: '게시판',
};

function notice(sequelize) {
  const Notice = sequelize.define(
    'notice',
    {
      type: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  Notice.getNotices = function(categoryId) {
    categoryId = Number.parseInt(categoryId, 10);

    return Notice.findAll()
      .then(notices =>
        Promise.all(
          notices.map(async notice => {
            const noticeArticle = await notice.getArticle();
            if (!(categoryId === noticeArticle.categoryId || notice.type === 1))
              return;

            const article = await noticeArticle.getListViewData();

            return {
              type: type[notice.type],
              article,
            };
          }),
        ),
      )
      .then(notices => notices.filter(e => e));
  };

  return Notice;
}

export default notice;
