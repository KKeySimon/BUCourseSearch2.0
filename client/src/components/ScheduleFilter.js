//This is a modified version of:
//https://stackblitz.com/edit/dynamic-add-and-delete-85uysp?file=index.js,index.html
import React, { Component } from 'react';

let dayDict = {
    'M': 'Monday',
    'T': 'Tuesday',
    'W': 'Wednesday',
    'R': 'Thursday',
    'F': 'Friday',
    'S': 'Saturday',
    'U': 'Sunday'
}
let processVisualInput = (str) => {
    let temp = str.split(" ")
    let days = temp[0]

    let result = ""
    for (let i = 0; i < days.length; i++) {
        let d = dayDict[days.charAt(i)]
        result = result + " " + d
    }

    result = result + " " + temp[1]
    return result
}

let processData = (str) => {
    let arr = str.split(" ")
    let days = arr[0]
    let hours = arr[1].split("-")
    let t1 = parseInt(hours[0].split(":")[0])*60 + parseInt(hours[0].split(":")[1])
    let t2 = parseInt(hours[1].split(":")[0]*60) + parseInt(hours[1].split(":")[1])
    return {"days": days, "start": t1, "end": t2}
}

class ScheduleFilter extends Component {
  constructor() {
    super();
    this.state = {
      // should be a list of dictionaries with key "start", "end", and "days"
      visualList: [],
      data: [],
      itemName: ''
    };
  }
  handleChange = (event) => {
    this.setState({itemName: event.target.value});
  }
  delete = (index) => {
    this.state.visualList.splice(index, 1);
    this.state.data.splice(index, 1)
    this.setState({list: this.state.visualList})
    this.setState({data: this.state.data})
    console.log(index);
  }

  add = () => {
    const visualList = [...this.state.visualList]
    const data = [...this.state.data]
    visualList.push(processVisualInput(this.state.itemName));
    data.push(processData(this.state.itemName))
    console.log(data)
    console.log(visualList)
    this.setState({data: data})
    this.setState({visualList: visualList});
    this.setState({itemName: ''})
  }

  render() { 
    const renderData = () => {
      return this.state.visualList.map((item, index) => {
        return (
          <div key={item}>{item}  
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
      /> <button onClick={() => this.add()}>Click to add</button>
        
        {renderData()}
      </div>
    );
  }
}

export default ScheduleFilter
