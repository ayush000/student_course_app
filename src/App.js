import CourseTable from './CourseTable';
import React from 'react';
import { browserHistory } from 'react-router';
import { Button } from 'antd';
const baseUrl = require('../constants').baseUrl;

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      credits: 0,
      majorCredits: 0,
      buttonDisabled: true,
      selectedRows: [],
    };
  }
  submitCourses = () => {
    const { selectedRows } = this.state;
    const userId = parseInt(sessionStorage.getItem('userId'), 10);
    const courseIds = selectedRows.map(row => row.key);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, courseIds }),
    };
    fetch(`${baseUrl}/api/storeCourses`, options)
      .then(response => response.json())
      .then(response => {
        alert(response.text);
        this.logout();
      });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const credits = selectedRows.reduce((init, row) =>
      init + row.Credits, 0);
    const majorCredits = selectedRows.reduce((init, row) => {
      if (row.Category === 'Major') {
        return init + row.Credits;
      }
      return init;
    }, 0);
    this.setState({ credits, majorCredits, selectedRows });
    if (credits >= 17 && credits <= 27 && majorCredits >= 14) {
      this.setState({ buttonDisabled: false });
    }
  }

  logout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    browserHistory.push('/login');
  }

  render() {
    const userId = sessionStorage.getItem('userId'),
      userName = sessionStorage.getItem('userName');
    const { buttonDisabled } = this.state;
    return (
      <div>
        <h1>Hello {userName},</h1>
        <Button onClick={this.logout}>Log out</Button>
        <div><b>17 - 27 credits in total required. Minimum 14 major credits required.</b></div>
        <div><b>Credits accumulated: {this.state.credits}.
          Major credits accumulated: {this.state.majorCredits}</b></div>
        <CourseTable userId={userId}
          buttonDisabled={buttonDisabled}
          onSelectChange={this.onSelectChange}
          submitCourses={this.submitCourses} />
      </div>
    );
  }
};
