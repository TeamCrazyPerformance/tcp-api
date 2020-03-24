import { Sequelize } from 'sequelize';
import { dbConfig } from './configs';
import { Console } from '../utils';
import User from '../users/model';

const db = {
  sequelize: null,
  User: null,

  async connect() {
    this.sequelize = new Sequelize(dbConfig());
    this.User = User(this.sequelize);

    this.sequelize
      .authenticate()
      .then(async () => {
        Console.log('⭕️ Connection has been established successfully.');
        await this.sequelize.sync({ force: true });
      })
      .catch(err => {
        Console.error('❌  Unable to connect to the database:', err);
      });

    return db;
  },
};

export default db;
