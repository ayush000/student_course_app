import React from 'react';
import ReactDOM from 'react-dom';
import CourseTable from './CourseTable';
import Login from './Login';
import './index.css';
import NotFound from './NotFound';
import { Router, Route, browserHistory } from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={CourseTable} />
    <Route path="/login" component={Login} />
    <Route path="*" component={NotFound} />
  </Router>,
  document.getElementById('root')
);
