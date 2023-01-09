//This is a modified version of:
//https://stackblitz.com/edit/dynamic-add-and-delete-85uysp?file=index.js,index.html
import React, { Component } from 'react';

class ScheduleFilter extends Component {
  constructor() {
    super();
    this.state = {
      list:[],
      itemName: ''
    };
  }
  handleChange = (event) => {
    this.setState({itemName: event.target.value});
  }
  delete = (index) => {
    this.state.list.splice(index, 1);
    this.setState({list: this.state.list})
    console.log(index);
  }
  add = () => {
    const list = [...this.state.list]
    list.push(this.state.itemName);
    this.setState({list: list});
    this.setState({itemName: ''})
  }

  render() { 
    const renderData = () => {
      return this.state.list.map((item, index) => {
        return (
          <div key={item}>
            <input type="checkbox" /> {item}  
            <button onClick={() => this.delete(index)}>Remove</button>
            </div>
        )
      })
    }

    return (
      <div>
        <input
        type="text"
        value={this.state.itemName}
        onChange={this.handleChange}
      /> <button onClick={this.add}>Click to add</button>
        
        {renderData()}
      </div>
    );
  }
}

export default ScheduleFilter
