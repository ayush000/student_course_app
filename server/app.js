const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const queries = require('./queries');

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

app.get('/api/checkUser', (req, res) => {
  const user_id = req.query.id;
  const checkStudentQuery = 'SELECT * FROM student WHERE id = ?';
  const q = connection.query(checkStudentQuery, [user_id], (err, response) => {
    if (err || response.length === 0) {
      const errorObj = {
        'type': 'error',
        'text': `No such user found`,
        'query': q.sql,
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
      'type': 'error',
      'text': 'No user sent',
    });
  }
  const q = connection.query(queries.allCoursesQuery, [userId, userId, userId],
    (err, response) => {
      if (err) {
        return res.status(500).send({
          'type': 'error',
          'text': 'No response to display',
          'query': q.sql,
        });
      }
      res.send({
        'type': 'success',
        'response': response,
      });
    });
});

app.get('/api/courses/recommended', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(404).send({
      'type': 'error',
      'text': 'No user sent',
    });
  }
  const q = connection.query(queries.recommendedCoursesQuery, [userId, userId],
    (err, response) => {
      if (err) {
        return res.status(500).send({
          'type': 'error',
          'text': 'No response to display',
          'query': q.sql,
        });
      }
      res.send({
        'type': 'success',
        'response': response,
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
