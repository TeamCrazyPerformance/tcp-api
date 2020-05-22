import { DataTypes } from 'sequelize';

const TYPE = {
  전체: 1,
  게시판: 2,
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

  Notice.createNotice = function(notice) {
    notice.type = TYPE[notice.type];

    return Notice.create(notice);
  };

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
              type: TYPE[notice.type],
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
