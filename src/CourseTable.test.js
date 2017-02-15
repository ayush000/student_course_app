import React from 'react';
import ReactDOM from 'react-dom';
import CourseTable from './CourseTable';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CourseTable />, div);
});
