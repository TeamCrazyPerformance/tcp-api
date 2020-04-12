import { DataTypes } from 'sequelize';

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

  return Article;
}

export default article;
