import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import './index.css';
import NotFound from './NotFound';
import { Router, Route, browserHistory } from 'react-router';

function requireAuth(nextState, replace) {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    replace({
      pathname: '/login',
    });
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App} onEnter={requireAuth} />
    <Route path="/login" component={Login} />
    <Route path="*" component={NotFound} />
  </Router>,
  document.getElementById('root')
);
