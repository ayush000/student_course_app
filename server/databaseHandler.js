const queries = require('./queries');
const constants = require('../constants');
function validateCourses(connection, courses, callback) {
  const q = connection.query(queries.validateQuery, [courses], (err, rows) => {
    if (err) return callback({ err, query: q.sql });
    const { total, major } = rows[0];
    if (total >= constants.credits.minimum && total <= constants.credits.maximum
      && major >= constants.majorCredits.minimum && major <= constants.majorCredits.maximum) {
      return callback(null, true);
    }
    callback(null, false);
  });
};

function storeCourses(connection, courseIds, userId, callback) {
  const data = courseIds.map(courseId => [userId, courseId]);
  const q = connection.query(queries.storeCoursesQuery, [data], (err) => {
    if (err) return callback({ err, query: q.sql });
    callback();
  });
}

exports.validateCourses = validateCourses;
exports.storeCourses = storeCourses;
