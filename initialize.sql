CREATE DATABASE course_app;
USE course_app;
CREATE TABLE `category` (
  `id` TINYINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
);

INSERT INTO `category` (`id`, `name`)
VALUES
	(1, 'Major'),
	(2, 'Maths'),
	(3, 'Management'),
	(4, 'English');

CREATE TABLE `course` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(16) NOT NULL DEFAULT '',
  `name` varchar(64) NOT NULL DEFAULT '',
  `professor_id` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) NOT NULL DEFAULT '0',
  `credits` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

INSERT INTO `course` (`id`, `code`, `name`, `professor_id`, `category_id`, `credits`)
VALUES
	(1, 'MA201', 'Discrete Mathematics 1', 1, 2, 4),
	(2, 'MA202', 'Discrete Mathematics 2', 2, 2, 4);

CREATE TABLE `course_prerequisite` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `prerequisite_course_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `course_prerequisite` (`id`, `course_id`, `prerequisite_course_id`)
VALUES
	(1, 2, 1);

CREATE TABLE `professor` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
);

INSERT INTO `professor` (`id`, `name`)
VALUES
	(1, 'Abraham Lincoln'),
	(2, 'Isaac Newton');

CREATE TABLE `student` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
);

INSERT INTO `student` (`id`, `name`)
VALUES
	(1, 'Ayush Sachdeva'),
	(2, 'Jayesh Kumar');

CREATE TABLE `student_course` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `semester` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
);