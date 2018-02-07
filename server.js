const express = require('express');
const bodyParser = require('body-parser');
const Provider = require('oidc-provider');

const port = process.env.PORT || 8050;

// Create application
const app = express();

// Add middleware
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));

// Create endpoints
const router = express.Router();
app.use('/', router);

const oidc = new Provider(`http://localhost:${port}`);
oidc.initialize().then(() => {
  app.use('/oidc', oidc.callback);
});

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'hi greg',
  });
});


// Start server
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});