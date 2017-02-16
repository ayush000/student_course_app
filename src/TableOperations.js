import React from 'react';
import { Radio, Input, Select } from 'antd';
const Option = Select.Option;

export default class TableOperations extends React.Component {
  constructor() {
    super();
    this.state = {
      radioSelected: 'all',
      searchText: '',
      professorsSelected: [],
    };
  }

  onSearch = (e) => {
    const { value } = e.target;
    this.props.filterTable(value, this.state.professorsSelected);
    this.setState({ searchText: value });
  }

  onCourseSwitch = (e) => {
    const radioSelected = e.target.value;
    this.setState({ radioSelected });
    this.props.onCourseSwitch(radioSelected);
  }

  onProfessorSelect = (professorsSelected) => {
    this.props.filterTable(this.state.searchText, professorsSelected);
    this.setState({ professorsSelected });
  }

  render() {
    const { radioSelected, professorsSelected } = this.state;
    return (
      <div className="table-operations">
        <Radio.Group size="default" value={radioSelected}
          onChange={this.onCourseSwitch}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="recommended">Recommended</Radio.Button>
        </Radio.Group>
        <Input
          placeholder="Search name"
          style={{ width: '30%' }}
          onChange={this.onSearch}
          value={this.state.searchText} />
        <Select tags
          value={professorsSelected}
          style={{ width: '30%' }}
          placeholder="Choose professors"
          onChange={this.onProfessorSelect}>
          {this.props.professors.map(prof =>
            <Option key={prof}>{prof}</Option>)}
        </Select>
      </div>
    );
  }
}
