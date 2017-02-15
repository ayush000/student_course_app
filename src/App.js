import React from 'react';
import { Table, Button, Radio, Input, Select } from 'antd';
const Option = Select.Option;
import { baseUrl } from './constants';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      dataSource: [],
      selectedRows: [],
      radioSelected: 'all',
      filteredData: [],
      searchText: '',
      professorsSelected: [],
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
        this.setState({
          dataSource: res.response,
          filteredData: res.response,
        });
      });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows });
  }

  onSearch = (e) => {
    const { value } = e.target;
    this.filterTable(value, this.state.professorsSelected);
    this.setState({ searchText: value });
    // this.setState({ filterDropdownVisible: false });
  }

  onProfessorSelect = (professorsSelected) => {
    this.filterTable(this.state.searchText, professorsSelected);
    this.setState({ professorsSelected });
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
    const { filteredData, radioSelected, professorsSelected } = this.state;
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
      <div className="App">
        <div className="table-operations">
          <Radio.Group size="default" value={radioSelected}
            onChange={(e) => this.setState({ radioSelected: e.target.value })}>
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="recommended">Recommended</Radio.Button>
          </Radio.Group>
          <Input
            placeholder="Search name"
            style={{ width: '30%' }}
            onChange={this.onSearch}
            value={this.state.searchText}
          />
          <Select tags
            value={professorsSelected}
            style={{ width: '30%' }}
            placeholder="Choose professors"
            onChange={this.onProfessorSelect}>
            <Option key="Abraham Lincoln">Abraham Lincoln</Option>
            <Option key="Isaac Newton">Isaac Newton</Option>
          </Select>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={filteredData} />
        <div className="App">
          <Button type="primary" onClick={this.submitCourses}>Submit</Button>
        </div>
      </div>
    );
  }
}

export default App;
