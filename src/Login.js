import React from 'react';
import { Input, Icon } from 'antd';
import { browserHistory } from 'react-router';
import './Login.css';
import { baseUrl } from './constants';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
    };
  }

  onChange = (e) => {
    const { value } = e.target;
    const reg = /^\d*$/;
    if (!isNaN(value) && reg.test(value)) {
      this.setState({ userId: value });
    }
  }

  onSubmit = (e) => {
    const userId = this.state.userId;
    this.setState({ userId: '' });
    const url = `${baseUrl}/api/checkUser?id=${userId}`;
    fetch(url)
      .then(response => {
        if (response && response.status < 400) {
          return response;
        } else {
          const error = new Error('Unable to visit api');
          error.response = response;
          throw error;
        }
      })
      .then(response => response.json())
      .then(response => {
        if (response.type === 'error') {
          alert(response.text);
        } else {
          sessionStorage.setItem('userId', userId);
          sessionStorage.setItem('userName', response.userName);
          browserHistory.push('/');
        }
      });
  }

  render() {
    return (
      <div className="form-container">
        <Input value={this.state.userId}
          placeholder="Enter your user ID, then press enter"
          onChange={this.onChange}
          prefix={<Icon type="user" />}
          maxLength="25"
          onPressEnter={this.onSubmit} />
      </div>
    );
  }
}
export default Login;
