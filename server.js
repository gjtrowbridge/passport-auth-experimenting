const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const OpenIDStrategy = require('passport-openid').Strategy;

passport.use(new OpenIDStrategy(
  {
    returnURL: 'https://whispering-retreat-73590.herokuapp.com/auth/openid/return',
    realm: 'https://whispering-retreat-73590.herokuapp.com',
  },
  (identifier, done) => {
    console.log('xcxc creating user with id:', identifier);
    const user = {
      identifier,
    };
    done(undefined, user);
  }
));

const port = process.env.PORT || 8050;

// Create application
const app = express();

// Add middleware
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));

// Serve static files
app.use(express.static(__dirname + '/public'));

// Create auth endpoints
const authRouter = express.Router();
app.use('/auth', authRouter);
authRouter.post('/openid', passport.authenticate('openid'));
authRouter.get('/openid/return', passport.authenticate('openid', {
  successRedirect: '/success',
  failureRedirect: '/failure',
}));

// Create API endpoints
const apiRouter = express.Router();

app.use('/api', apiRouter);
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    message: 'hi greg',
  });
});

// Start server
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});