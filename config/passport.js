const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../utils/passwordUtils');
const { getUserByEmail, getUserByID } = require('../db/queries');

const customFields = {
  usernameField: 'email',
  passwordField: 'password'
};

const verifyCallback = async (email, password, done) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return done(null, false);
    }
    
    const isValid = await validPassword(password, user.password);
    return isValid ? done(null, user) : done(null, false);
  } catch (error) {
    console.error('Error executing query', error.stack);
    return done(error);
  }
}
const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserByID(id);
    done(null, user);
  } catch (error) {
    console.error('Error executing query', error.stack);
    done(error);
  }
});