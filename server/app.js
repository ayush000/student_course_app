const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const queries = require('./queries');
const bodyParser = require('body-parser');
const databaseHandler = require('./databaseHandler');
const { NODE_ENV } = process.env;
const app = express();
let connection;
if (NODE_ENV === 'production') {
  connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
} else {
  connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'ayush',
    password: 'f6Ugm4cgPfGr',
    database: 'course_app',
    debug: NODE_ENV === 'production' ? false : ['ComQueryPacket'],
  });
}

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

// Setup logger
app.use(morgan('dev'));
app.use(cors());

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/api/checkUser', (req, res) => {
  const userId = req.query.id;
  const q = connection.query(queries.checkUserQuery, [userId], (error, response) => {
    if (error || response.length === 0) {
      const errorObj = {
        type: 'error',
        error,
        text: 'No such user',
      };
      console.log(errorObj, q.sql);
      return res.send(errorObj);
    }
    res.send({
      'type': 'success',
      'userName': response[0].name,
    });
  });
});



app.get('/api/courses/all', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(404).send({
      type: 'error',
      text: 'No user sent',
    });
  }

  const q = connection.query(queries.allCoursesQuery, [userId, userId, userId],
    (err, response) => {
      if (err) {
        return res.status(500).send({
          type: 'error',
          err,
          query: q.sql,
        });
      }
      res.send({
        type: 'success',
        response,
      });
    });
});

app.get('/api/courses/recommended', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(404).send({
      type: 'error',
      text: 'No user sent',
    });
  }

  const q = connection.query(queries.recommendedCoursesQuery, [userId, userId, userId],
    (err, response) => {
      if (err) {
        return res.status(500).send({
          type: 'error',
          err,
          query: q.sql,
        });
      }
      res.send({
        type: 'success',
        response,
      });
    });
});

app.post('/api/storeCourses', (req, res) => {
  const { userId, courseIds } = req.body;
  databaseHandler.validateCourses(connection, courseIds, (err, isValid) => {
    if (err || !isValid) {
      return res.status(500).send({
        type: 'error',
        text: 'Total credits are not valid',
        err,
      });
    }
    databaseHandler.storeCourses(connection, courseIds, userId, (err) => {
      if (err) {
        return res.status(500).send({
          type: 'error',
          text: 'Unable to insert in database',
          err,
        });
      }
      res.send({
        type: 'success',
        text: 'stored',
      });
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
