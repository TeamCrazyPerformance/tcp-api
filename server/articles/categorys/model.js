import { DataTypes } from 'sequelize';

function category(sequelize) {
  const Category = sequelize.define(
    'category',
    {
      name: DataTypes.STRING(20),
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  return Category;
}

export default category;
