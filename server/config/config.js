import path from 'path';
import { config } from 'dotenv';

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });
config({ path: path.join(__dirname, `../../db/.env.${process.env.NODE_ENV}`) });

const {
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
} = process.env;

export const dbConfig = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT+9',
  },
};

export const development = dbConfig;
export const test = dbConfig;

export const passportConfig = () => ({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_REDIRECT_URI,
});

export const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
