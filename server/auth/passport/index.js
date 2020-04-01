import passport from 'passport';
import github from './githubStrategy';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

github(passport);

export default passport;
