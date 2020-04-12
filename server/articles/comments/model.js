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

  return Comment;
}

export default comment;
