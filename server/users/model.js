import { DataTypes } from 'sequelize';
import { generateJwt } from '../auth';

function user(sequelize) {
  const User = sequelize.define(
    'user',
    {
      grade: DataTypes.INTEGER,
      schoolRegister: DataTypes.STRING(15),
      phone: DataTypes.STRING(40),
      birth: DataTypes.STRING(15),
      email: DataTypes.STRING(40),
      username: DataTypes.STRING(15),
      blog: DataTypes.STRING(100),
      avatar: DataTypes.STRING,
      githubId: DataTypes.STRING(30),
      githubUsername: DataTypes.STRING(30),
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  User.getUserByGithub = async function(githubId) {
    const user = await User.findOne({ where: { githubId } });
    return user;
  };

  User.prototype.getProfile = function(needToken) {
    const { id, avatar, username, githubUsername: github, membershipId } = this;
    const isAdmin = membershipId < 3;
    const token = needToken ? generateJwt({ id, github, isAdmin }) : undefined;
    return {
      id,
      avatar,
      username,
      github,
      token,
    };
  };

  User.prototype.getUserInfo = function(needSignup) {
    const { id, avatar, username, blog, email, githubUsername: github } = this;
    const token = generateJwt({ id, needSignup });

    return {
      id,
      avatar,
      username,
      github,
      blog,
      email,
      needSignup,
      token,
    };
  };

  User.save = async function(where) {
    return await User.findOrCreate({ where });
  };

  User.updateInfo = async function(user) {
    const {
      id,
      grade,
      schoolRegister,
      phone,
      birth,
      email,
      username,
      blog,
    } = user;
    const where = { id };
    const value = {
      grade,
      schoolRegister,
      phone,
      birth,
      email,
      username,
      blog,
    };

    return await User.update(value, { where });
  };

  return User;
}

export default user;
