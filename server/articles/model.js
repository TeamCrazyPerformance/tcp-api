import { DataTypes } from 'sequelize';
import { database as db } from '../config';

const DEFAULT_CATEGORY = 1;
const DEFAULT_LIMIT = 10;
const DEFUALT_OFFSET = 0;

function article(sequelize) {
  const Article = sequelize.define(
    'article',
    {
      title: DataTypes.STRING(100),
      contents: DataTypes.TEXT,
      viewCount: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  Article.filterCategory = async function(
    categoryId = DEFAULT_CATEGORY,
    { limit = DEFAULT_LIMIT, offset = DEFUALT_OFFSET },
  ) {
    const category = await db.Category.findByPk(categoryId);
    const articles = await category
      .getArticles({
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      })
      .then(articles =>
        Promise.all(
          articles.map(async article => {
            const [author, comments] = await Promise.all([
              article.getUser(),
              article.getComments(),
            ]);
            return article.extract(false, {
              author: author.username,
              commentCount: comments.length,
            });
          }),
        ),
      );

    const where = { categoryId: category.id };
    const articleCounts = await db.Article.count({
      where,
    });

    return [articles, articleCounts];
  };

  Article.prototype.adaptComment = async function() {
    const comments = await this.getComments();

    return Promise.all(
      comments.map(async comment => {
        const author = await comment.getUser();
        return comment.extract({
          author: author.getProfile(),
        });
      }),
    );
  };

  Article.prototype.extract = function(withContents, options) {
    let { id, viewCount, title, contents, createdAt, updatedAt } = this;
    if (!withContents) contents = undefined;

    return {
      id,
      title,
      viewCount,
      contents,
      createdAt,
      updatedAt,
      ...options,
    };
  };

  return Article;
}

export default article;
