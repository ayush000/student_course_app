import React from 'react';
import { Table, Button } from 'antd';

let baseUrl = '';
if (process.env.NODE_ENV === 'production') {
  baseUrl = '';
} else {
  baseUrl = 'http://localhost:9000';
}

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      dataSource: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    fetch(`${baseUrl}/api/courses`)
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
      .then(res => {
        // const response = res.response;
        this.setState({ dataSource: res.response });
      });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows });
  }

  render() {
    const { dataSource } = this.state;
    const columns = dataSource.length > 0 ? Object.keys(dataSource[0]).map(t => ({
      title: t,
      dataIndex: t,
    })).filter(t => t.title !== 'key') : [];

    const rowSelection = {
      onChange: this.onSelectChange,
    };

    return (
      <div className="App">
        <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
      </div>
    );
  }
}

export default App;
