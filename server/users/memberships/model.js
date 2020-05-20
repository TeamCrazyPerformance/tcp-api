import { DataTypes } from 'sequelize';

function membership(sequelize) {
  const Membership = sequelize.define(
    'membership',
    {
      name: DataTypes.STRING(15),
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  return Membership;
}

export default membership;
