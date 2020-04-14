import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router, database, corsOptions } from './config';
import passport from './auth/passport';

database.connect({ logging: false });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors(corsOptions));

app.use('/api', router);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`${PORT}번 listen!`);
  });
}

export default app;
