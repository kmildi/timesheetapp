import React from 'react'

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      date: new Date(),
    }
    this.saveHistory = this.saveHistory.bind(this);
    this.setHours = this.setHours.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  setHours(value) {
    this.setState({ hours: value });
  }

  setDate(value) {
    this.setState({ date: new Date(value) });
  }

  saveHistory(event) {
    event.preventDefault();
    this.props.saveHistory({date: this.state.date, hours: this.state.hours});
    this.setState({ hours: 0, date: new Date() });
  }

  render() {
    const records = this.props.history.map((elem, index) => {
      return (
        <li key={index}>
          dátum: {elem.date.toDateString()}, Óraszám: {elem.hours} 
          <button onClick={() => this.props.deleteRecord(index)}>delete</button>
        </li>
      );
    });
    return (
      <div>   
        {/* <h2 className="taskName">{this.props.task.name}</h2> */}
        <ul>{records}</ul>
        <form onSubmit={this.saveHistory}>
          <input 
            type="number" 
            step="0.5" 
            min="0" 
            max="24"
            value={this.state.hours}
            onChange={(e) => this.setHours(e.target.value)}>
          </input>
          <input 
            type="date" 
            onChange={(e) => this.setDate(e.target.value)}
            value={this.state.date.toISOString().slice(0, 10)}></input>
          <input type="submit" />
        </form>
      </div> 
    )
  }
}

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    }
    this.calcTotal = this.calcTotal.bind(this);
    this.saveHistory = this.saveHistory.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
  }

  calcTotal() {
    const history = this.state.history;
    let total = 0;
    history.forEach((elem, index) => { total += Number(elem.hours)});
    return total;
  }

  saveHistory(record) {
    const history = this.state.history.slice();
    this.setState({
      history: history.concat([
          record
      ]),
    })
  }

  deleteRecord(index) {
    const history = this.state.history.slice();
    if (index === 0) history.shift();
    else history.splice(index,index);
    this.setState({
      history
    })
  }

  render() {
    const taskTotal = this.calcTotal();
    return (
      <div>
        <span className="taskName">{this.props.task.name} </span>
        <span className="total">Total: {taskTotal}</span>
        <History
          history={this.state.history} 
          id={this.props.id} 
          saveHistory={this.saveHistory}         
          deleteRecord={this.deleteRecord}
          task={this.props.task}/>
      </div> 
    )
  }
}

class Tasklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksList: [
        { name: 'some important task', hours: 0 },
        { name: 'doing sg', hours: 0 },
        { name: 'other things', hours: 0 },
        { name: 'going somewhere', hours: 0 },
        { name: 'getting sg', hours: 0 },
      ],
      newTask: '',
    }
    this.textChangeHandler = this.textChangeHandler.bind(this);
    this.addTask = this.addTask.bind(this);
  }
  textChangeHandler(event){
    event.preventDefault();
    this.setState({ newTask: event.target.value });
  };

  addTask(event) {
    const newTask = this.state.newTask;
    console.log("newTask ", newTask);
    const tasksList = this.state.tasksList.slice();
    this.setState({
      tasksList: tasksList.concat([
        { name: newTask, hours: 0 }
      ]),
      newTask: '',
    })
  }

  render() {
    const tasks = this.state.tasksList.map((elem, index) => {
      return (
        <li key={index}>
          <Task task={elem} id={index}/>
        </li>
      )
    })
    return (
      <div>
        <ul>{tasks}</ul>
        <input
          type="text"
          placeholder="Add a new task!"
          value={this.state.newTask}
          onChange={this.textChangeHandler}
        />
        <button onClick={this.addTask}>Add!</button>
      </div>
    )
  }
}

export default Tasklist;
