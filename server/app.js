import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { router, database, corsOptions } from './config';
import passport from './auth/passport';
import { Console } from './utils';

database.connect();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors(corsOptions));

app.use('/api', router);

app.listen(PORT, () => {
  Console.log(`${PORT}번 listen!`);
});
