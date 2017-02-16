import React from 'react';
import { Table, Button } from 'antd';
import { baseUrl } from './constants';
import './CourseTable.css';
import TableOperations from './TableOperations';

export default class CourseTable extends React.Component {

  constructor() {
    super();
    this.state = {
      dataSource: [],
      selectedRows: [],
      filteredData: [],
    };
  }

  fetchCourses = (type) => {
    fetch(`${baseUrl}/api/courses/${type}?userId=${this.props.userId}`)
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
        this.setState({
          dataSource: res.response,
          filteredData: res.response,
        });
      });
  }
  componentDidMount() {
    this.fetchCourses('all');
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows });
  }

  filterTable = (searchText, professorsSelected) => {
    const { dataSource } = this.state;
    let filteredData = dataSource;
    // Filter on the basis of search text
    if (searchText.length > 0) {
      const reg = new RegExp(searchText, 'gi');
      filteredData = filteredData.filter(row => row.Name.match(reg));
    }
    // Filter on the basis of professors selected
    if (professorsSelected.length > 0) {
      filteredData = filteredData.filter(row =>
        professorsSelected.indexOf(row['Taught by']) > -1);
    }
    this.setState({ filteredData });
  }

  onCourseSwitch = (type) => {
    this.fetchCourses(type);
  }

  alphabeticSorter = (param, a, b) => {

    const nameA = a[param].toUpperCase(); // ignore upper and lowercase
    const nameB = b[param].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  }

  render() {
    const { filteredData } = this.state;
    const columns = [
      {
        'title': 'Course code',
        'dataIndex': 'Course code',
        'sorter': this.alphabeticSorter.bind(this, 'Name'),
      },
      {
        'title': 'Name',
        'dataIndex': 'Name',
      },
      {
        'title': 'Category',
        'dataIndex': 'Category',
      },
      {
        'title': 'Taught by',
        'dataIndex': 'Taught by',
      },
      {
        'title': 'Prerequisite',
        'dataIndex': 'Prerequisite',
      },
      {
        'title': 'Credits',
        'dataIndex': 'Credits',
        'sorter': (a, b) => a.Credits - b.Credits,
      },
    ];
    const rowSelection = {
      onChange: this.onSelectChange,
    };

    return (
      <div>
        <TableOperations filterTable={this.filterTable} onCourseSwitch={this.onCourseSwitch} />
        <Table rowSelection={rowSelection} columns={columns} dataSource={filteredData} />
        <div>
          <Button type="primary" onClick={this.submitCourses}>Submit</Button>
        </div>
      </div>
    );
  }
}
