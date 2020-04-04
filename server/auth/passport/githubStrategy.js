import { Strategy as GitHubStrategy } from 'passport-github';
import { passportConfig, database as db } from '../../config';

const extractProfile = profile => {
  const { id: githubId, username: githubUsername, _json } = profile;

  const {
    blog = '',
    email = '',
    bio: username = '',
    avatar_url: avatar,
  } = _json;

  return {
    githubId,
    avatar,
    email,
    username,
    blog,
    githubUsername,
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
