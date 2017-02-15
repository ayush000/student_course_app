const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'ayush',
  password: 'f6Ugm4cgPfGr',
  database: 'course_app',
});

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
    });
  });
});

app.get('/api/courses', (req, res) => {
  const allCoursesQuery = 'SELECT a.course_id `key`, `Course code`, `Name`, `Category`, `Taught by`, cpr_name `Prerequisite`,a.`Credits` FROM (SELECT c.id `course_id`, c.code `Course code`, c.`Name` `Name`, cat.name `Category`, p.name `Taught by`, c.credits `Credits` FROM course c, professor p, category cat WHERE c.professor_id = p.id AND c.category_id = cat.id) a LEFT JOIN (SELECT cpr.course_id `course_id`, c.name `cpr_name` FROM course_prerequisite cpr, course c WHERE c.id = cpr.prerequisite_course_id) b ON a.course_id = b.course_id';
  const q = connection.query(allCoursesQuery, (err, response) => {
    if (err || response.length === 0) {
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
