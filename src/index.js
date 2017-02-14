import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import './index.css';
import NotFound from './NotFound';
import { Router, Route, browserHistory } from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/login" component={Login} />
    <Route path="*" status={404} component={NotFound} />
  </Router>,
  document.getElementById('root')
);
