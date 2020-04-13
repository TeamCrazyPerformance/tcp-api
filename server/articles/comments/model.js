import { DataTypes } from 'sequelize';

function comment(sequelize) {
  const Comment = sequelize.define(
    'comment',
    {
      contents: DataTypes.TEXT,
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  Comment.prototype.extract = function(options) {
    const { id, contents, createdAt, updatedAt } = this;
    return {
      id,
      contents,
      createdAt,
      updatedAt,
      ...options,
    };
  };

  return Comment;
}

export default comment;
