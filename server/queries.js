// Query to fetch recommended courses for student, where he satisfies all prerequisites
// takes student ID twice as parameter
const recommendedCoursesQuery = 'SELECT ' +
  '  prereq.course_id ' +
  'FROM ( ' +
  '  SELECT ' +
  '    course_id, ' +
  '    prerequisite_course_id ' +
  '  FROM ' +
  '    course_prerequisite ' +
  '  WHERE ' +
  '    course_id IN ( ' +
  '    SELECT ' +
  '      cpr.course_id ' +
  '    FROM ' +
  '      student_course sc, ' +
  '      course_prerequisite cpr ' +
  '    WHERE ' +
  '      sc.course_id = cpr.prerequisite_course_id ' +
  '      AND student_id = ?)) prereq ' +
  'LEFT JOIN ( ' +
  '  SELECT ' +
  '    course_id ' +
  '  FROM ' +
  '    student_course ' +
  '  WHERE ' +
  '    student_id = ?) AS sc ' +
  'ON ' +
  '  prereq.prerequisite_course_id = sc.course_id GROUP BY prereq.course_id HAVING COUNT(1) = COUNT(sc.course_id)';

// Takes student id as parameter and lists all courses for which the student is eligible
// student id is required as query parameter thrice
const allCoursesQuery = 'SELECT ' +
  '  a.course_id `key`, ' +
  '  `Course code`, ' +
  '  `Name`, ' +
  '  `Category`, ' +
  '  `Taught by`, ' +
  '  GROUP_CONCAT(cpr_name) `Prerequisite`, ' +
  '  a.`Credits` ' +
  'FROM ( ' +
  '  SELECT ' +
  '    c.id `course_id`, ' +
  '    c.code `Course code`, ' +
  '    c.`Name` `Name`, ' +
  '    cat.name `Category`, ' +
  '    p.name `Taught by`, ' +
  '    c.credits `Credits` ' +
  '  FROM ' +
  '    course c, ' +
  '    professor p, ' +
  '    category cat ' +
  '  WHERE ' +
  '    c.professor_id = p.id ' +
  '    AND c.category_id = cat.id ' +
  '    AND c.id NOT IN ( ' +
  '    SELECT ' +
  '      course_id ' +
  '    FROM ' +
  '      student_course ' +
  '    WHERE ' +
  '      student_id = ?)) a ' +
  'LEFT JOIN ( ' +
  '  SELECT ' +
  '    cpr.course_id `course_id`, ' +
  '    c.name `cpr_name` ' +
  '  FROM ' +
  '    course_prerequisite cpr, ' +
  '    course c ' +
  '  WHERE ' +
  '    c.id = cpr.prerequisite_course_id) b ' +
  'ON ' +
  '  a.course_id = b.course_id ' +
  'GROUP BY ' +
  '  a.course_id, ' +
  '  `Course code`, ' +
  '  `Name`, ' +
  '  `Category`, ' +
  '  `Taught by`, ' +
  '  `Credits` ' +
  'HAVING ' +
  '  (Prerequisite IS NULL ' +
  '    OR `key` IN (' + recommendedCoursesQuery + '))';

exports.recommendedCoursesQuery = recommendedCoursesQuery;
exports.allCoursesQuery = allCoursesQuery;
