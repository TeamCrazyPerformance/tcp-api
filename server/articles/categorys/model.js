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

  Category.getCategory = async function(name) {
    const where = { name };
    const category = await Category.findOne({ where });

    return category;
  };

  return Category;
}

export default category;
