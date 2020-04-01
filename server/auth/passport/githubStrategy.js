import { Strategy as GitHubStrategy } from 'passport-github';
import { passportConfig, database as db } from '../../config';

const extractProfile = profile => {
  const { id, photos, email = '', username, blog = '' } = profile;

  return {
    githubId: id,
    avatar: photos[0].value,
    email,
    blog,
    githubUsername: username,
  };
};

export default passport => {
  passport.use(
    new GitHubStrategy(passportConfig(), async (_, __, profile, done) => {
      const User = db.User;
      const { id } = profile;

      try {
        let user = await User.getUserByGithub(id);

        if (user) return done(null, user.getProfile(true));

        const [savedUser, created] = await User.save(extractProfile(profile));
        if (!created) return done(null, false);

        return done(null, savedUser.getProfile(false));
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }),
  );
};
