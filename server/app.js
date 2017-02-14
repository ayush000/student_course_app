const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
// const sql = require()

const app = express();

// Setup logger
app.use(morgan('dev'));
app.use(cors());

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/checkUser', (req, res) => {

  res.send({
    'type': 'error',
    'text': 'No such user found',
  });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
