import { Sequelize } from 'sequelize';
import { dbConfig } from './config';
import Users from '../users/model';
import Memberships from '../users/memberships/model';
import Articles from '../articles/model';
import Comments from '../articles/comments/model';
import Categorys from '../articles/categorys/model';

const db = {
  sequelize: null,
  User: null,
  Article: null,
  Comment: null,
  Category: null,
  Membership: null,

  async connect(options) {
    const sequelize = new Sequelize({ ...dbConfig, ...options });
    this.sequelize = sequelize;
    this.Membership = Memberships(sequelize);
    this.User = Users(sequelize);
    this.Article = Articles(sequelize);
    this.Comment = Comments(sequelize);
    this.Category = Categorys(sequelize);

    const { Membership, User, Article, Comment, Category } = this;

    Membership.hasMany(User);
    User.belongsTo(Membership, {
      foreignKey: {
        defaultValue: 4,
      },
    });

    User.hasMany(Article, {
      foreignKey: 'author',
    });
    Article.belongsTo(User, {
      foreignKey: 'author',
    });

    User.hasMany(Comment, {
      foreignKey: 'author',
    });
    Comment.belongsTo(User, {
      foreignKey: 'author',
    });

    Category.hasMany(Article, {
      foreignKey: 'categoryId',
    });
    Article.belongsTo(Category, {
      foreignKey: 'categoryId',
    });

    Category.belongsTo(Category, {
      foreignKey: 'parent',
    });

    Article.hasMany(Comment, {
      foreignKey: 'articleId',
    });
    Comment.belongsTo(Article, {
      foreignKey: 'articleId',
    });

    this.sequelize
      .authenticate()
      .then(async () => {
        console.log('⭕️ Connection has been established successfully.');
        await this.sequelize.sync();
      })
      .catch(err => {
        console.error('❌  Unable to connect to the database:', err);
      });

    return db;
  },
};

export default db;
