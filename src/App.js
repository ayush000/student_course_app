import CourseTable from './CourseTable';
import React from 'react';
import { browserHistory } from 'react-router';
import { Button } from 'antd';

export default class App extends React.Component {

  logout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    browserHistory.push('/login');
  }

  render() {
    const userId = sessionStorage.getItem('userId'),
      userName = sessionStorage.getItem('userName');
    return (
      <div>
        <h1>Hello {userName},</h1>
        <Button onClick={this.logout}>Log out</Button>
        <CourseTable userId={userId} />
      </div>
    );
  }
};
