const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const port = process.env.PORT || 8050;
// Create application
const app = express();

app.use((req, res, next) => {
  console.log(`Receiving ${req.method} to ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(__dirname + '/public'));

// Set up passport strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_SECRET,
    callbackURL: 'https://whispering-retreat-73590.herokuapp.com/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log('xcxc logging in with google', profile);
    return cb(null, profile);
  },
));

// Create API endpoints
const authRouter = express.Router();
app.use('/auth', authRouter);

authRouter.get('/google', passport.authenticate('google', { scope: ['email'] }));
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html', session: false }),
  (req, res) => {
    console.log('xcxc wooo we authenticated!!', req.user);
    res.redirect('/');
  }
);

// Start server
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});