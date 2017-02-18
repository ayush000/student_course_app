const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const async = require('async');
const bodyParser = require('body-parser');
const databaseHandler = require('./databaseHandler');
const app = express();
const connection = require('./mysql');

// Setup logger
app.use(morgan('dev'));
app.use(cors());

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/**
 * Check whether a user exists. Used as a login check.
 * query param = student ID
 * Returns student name on success
 */
app.get('/api/checkUser', (req, res) => {
  const userId = req.query.id;
  databaseHandler.checkUser(connection, userId, (err, response) => {
    if (err) return res.send(err);
    res.send(response);
  });
});

/**
 * Get all courses for a userId.
 * query param = student ID
 * Returns array of course objects on success.
 */
app.get('/api/courses/all', (req, res) => {
  const { userId } = req.query;
  databaseHandler.getAllCourses(connection, userId, (err, response) => {
    if (err) return res.send(err);
    res.send(response);
  });
});

/**
 * Get recommended courses for a userId.
 * query param = student ID
 * Returns array of course objects on success.
 */
app.get('/api/courses/recommended', (req, res) => {
  const { userId } = req.query;
  databaseHandler.getRecommendedCourses(connection, userId, (err, response) => {
    if (err) return res.send(err);
    res.send(response);
  });
});

/**
 * Store courses chosen by a student, after performing all validations
 */
app.post('/api/storeCourses', (req, res) => {
  const { userId, courseIds } = req.body;
  const validationTasks = [
    databaseHandler.validateCourses.bind(null, connection, userId, courseIds),
    databaseHandler.checkUser.bind(null, connection, userId),
    databaseHandler.validateCredits.bind(null, connection, courseIds),
  ];
  async.parallel(validationTasks, (err) => {
    if (err) return res.send(err);
    databaseHandler.storeCourses(connection, courseIds, userId, (err, response) => {
      if (err) return res.send(err);
      res.send(response);
    });
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
