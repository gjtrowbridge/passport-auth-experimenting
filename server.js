// server.js

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8050;

// Serve static files
app.use(express.static(__dirname + '/public'));

// Add session support
app.use(session({ secret: process.env.SESSION_SECRET || 'default_session_secret' }));

// Set up passport strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_SECRET,
    callbackURL: 'https://whispering-retreat-73590.herokuapp.com/auth/google/callback',
    scope: ['email'],
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log('Our user authenticated with Google, and Google sent us back this profile info identifying the authenticated user:', profile);
    return cb(null, profile);
  },
));

// Create API endpoints

// This is where users point their browsers in order to get logged in
// This is also where Google sends back information to our app once a user authenticates with Google
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html', session: false }),
  (req, res) => {
    console.log('wooo we authenticated, here is our user object:', req.user);
    res.json(req.user);
  }
);

app.get('/counter', (req, res) => {
  if (req.session.views_by_user) {
    req.session.views_by_user++;
  } else {
    req.session.views_by_user = 1;
  }
  res.send({
    views: req.session.views_by_user
  });
});

// Start server
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});