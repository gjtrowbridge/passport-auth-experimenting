const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 8050;

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
    console.log('logging in with google', profile);
    return cb(null, profile);
  },
));

// Create API endpoints
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure', session: false }),
  (req, res) => {
    console.log('xcxc wooo we authenticated!!', req.user);
    res.redirect('/');
  }
);
app.get('/login-failure', (req, res) => {
  res.send('Something went wrong, and you failed to log in.')
});

// Start server
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});