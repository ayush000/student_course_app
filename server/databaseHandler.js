const queries = require('./queries');
const constants = require('../constants');

/**
 * Check whether a user_id exists in student database
 * @param {object} connection mysql connection object
 * @param {number} userId Student ID, primary key in student database
 * @param {function} callback JS callback. Passes type of response & name of the student
 * @returns {null} null
 */
function checkUser(connection, userId, callback) {
  const q = connection.query(queries.checkUserQuery, [userId], (err, response) => {
    if (err || response.length === 0) {
      const errorObj = {
        type: 'error',
        err,
        text: 'No such user',
        query: q.sql,
      };
      console.log(errorObj);
      return callback(errorObj);
    }
    const resObj = {
      type: 'success',
      userName: response[0].name,
      text: 'Found user in database',
    };
    callback(null, resObj);
  });
}

/**
 * Check if the courses selected sum up to credits in the valid range.
 * @param {object} connection mysql connection object
 * @param {object} courses Array containing courseIds selected by the user
 * @param {function} callback JS callback. Passes success or error types.
 * @returns {null} null
 */
function validateCredits(connection, courses, callback) {
  const q = connection.query(queries.validateQuery, [courses], (err, rows) => {
    if (err) return callback({
      type: 'error',
      err,
      query: q.sql,
      text: 'Internal server error',
    });
    const { total, major, numCourses } = rows[0];
    if (numCourses === courses.length
      && total >= constants.credits.minimum && total <= constants.credits.maximum
      && major >= constants.majorCredits.minimum && major <= constants.majorCredits.maximum) {
      return callback(null, {
        type: 'success',
        text: 'Credits are valid',
      });
    }
    callback({
      type: 'error',
      query: q.sql,
      text: 'Total credits are not valid',
    });
  });
};

/**
 * Get all courses for which the student is eligible
 * @param {object} connection mysql connection object
 * @param {number} userId Student ID, primary key in student database
 * @param {function} callback JS callback. Passes array of objects containing details of each course
 * @returns {null} null
 */
function getAllCourses(connection, userId, callback) {
  if (!userId) return callback({
    type: 'error',
    text: 'No user sent',
  });

  const q = connection.query(queries.allCoursesQuery, [userId, userId, userId],
    (err, response) => {
      if (err) return callback({
        type: 'error',
        err,
        text: 'Internal server error',
        query: q.sql,
      });
      callback(null, {
        type: 'success',
        data: response,
      });
    });
}

/**
 * Check whether an array is a subset of another
 * @param {object} supersetArr Array that is supposed to be superset
 * @param {object} subsetArr Array that is supposed to be subset
 * @return {boolean} true, if every element in subsetArr is present in supersetArr
 */
function isSubset(supersetArr, subsetArr) {
  const superset = new Set(supersetArr),
    subset = new Set(subsetArr);
  for (let elem of subset) {
    if (!superset.has(elem)) return false;
  }
  return true;
}

/**
 * Check whether the student is eligible to take courses selected by him.
 * @param {object} connection mysql connection object
 * @param {number} userId Student ID, primary key in student database
 * @param {object} coursesTaken Array of courses chosen by student
 * @param {function} callback JS callback. Passes boolean status, whether student is eligible for all courses
 * @returns {null} null
 */
function validateCourses(connection, userId, coursesTaken, callback) {
  getAllCourses(connection, userId, (err, response) => {
    if (err) return callback(err);
    const eligibleCourses = response.data.map(row => row.key);
    if (!isSubset(eligibleCourses, coursesTaken)) {
      return callback({
        type: 'error',
        text: 'User not eligible to take all courses',
      });
    }
    callback(null, {
      type: 'success',
      text: 'User is eligible to take all courses',
    });
  });
}

/**
 * Get all courses for which the student is eligible and has completed prerequisite.
 * @param {object} connection mysql connection object
 * @param {number} userId Student ID, primary key in student database
 * @param {function} callback JS callback. Passes array of objects containing details of each course
 * @returns {null} null
 */
function getRecommendedCourses(connection, userId, callback) {
  if (!userId) return callback({
    type: 'error',
    text: 'No user sent',
  });

  const q = connection.query(queries.recommendedCoursesQuery, [userId, userId, userId],
    (err, response) => {
      if (err) {
        return callback({
          type: 'error',
          err,
          text: 'Internal server error',
          query: q.sql,
        });
      }
      callback(null, {
        type: 'success',
        data: response,
      });
    });
}

/**
 * Store courses selected by a student in student_course database
 * @param {object} connection mysql connection object
 * @param {object} courseIds Array of courses chosen by student
 * @param {number} userId Student ID, primary key in student database
 * @param {function} callback JS callback. Passes succes message
 * @returns {null} null
 */
function storeCourses(connection, courseIds, userId, callback) {
  const data = courseIds.map(courseId => [userId, courseId]);
  const q = connection.query(queries.storeCoursesQuery, [data], (err) => {
    if (err) return callback({
      err,
      query: q.sql,
      text: 'Internal server error',
    });
    callback(null, {
      type: 'success',
      text: 'stored',
    });
  });
}

exports.validateCourses = validateCourses;
exports.validateCredits = validateCredits;
exports.storeCourses = storeCourses;
exports.checkUser = checkUser;
exports.getAllCourses = getAllCourses;
exports.getRecommendedCourses = getRecommendedCourses;
