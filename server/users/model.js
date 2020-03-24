import { DataTypes } from 'sequelize';

function user(sequelize) {
  const User = sequelize.define(
    'user',
    {
      grade: DataTypes.INT,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      thumnail: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  User.lookup = async email => {
    const one = await User.findOne({ where: { email } });
    return one;
  };

  return User;
}

export default user;
