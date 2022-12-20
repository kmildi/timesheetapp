import React from 'react'

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      date: new Date().toISOString().slice(0, 10),
    }
    this.saveHistory = this.saveHistory.bind(this);
    this.setHours = this.setHours.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  setHours(value) {
    this.setState({ hours: value });
  }

  setDate(value) {
    this.setState({ date: value });
  }

  saveHistory(event) {
    event.preventDefault();
    this.props.saveHistory({date: this.state.date, hours: this.state.hours});
    this.setState({ hours: 0, date: new Date().toISOString().slice(0, 10) });
  }

  render() {
    const records = this.props.history.map((elem, index) => {
      return (
        <tr key={index}>
          <td>{elem.date}</td>
          <td>{elem.hours}</td>
          <td><button onClick={() => this.props.deleteRecord(index)}>delete</button></td>
        </tr>
      );
    });
    return (
      <div className="history">   
        {/* <h2 className="taskName">{this.props.task.name}</h2> */}
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records}
          </tbody>
        </table>
        <form className="newHoursForm" onSubmit={this.saveHistory}>
          <input 
            type="date" 
            onChange={(e) => this.setDate(e.target.value)}
            value={this.state.date}>
          </input>
          <input 
            type="number" 
            step="0.5" 
            min="0" 
            max="24"
            value={this.state.hours}
            onChange={(e) => this.setHours(e.target.value)}>
          </input>
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

  componentDidMount() {
    this.setState({ history: this.props.task.history });
  }

  calcTotal() {
    const history = this.state.history;
    let total = 0;
    history.forEach((elem, index) => { total += Number(elem.hours)});
    return total;
  }

  saveHistoryToServer(history, taskId) {
    fetch("/history", {
      method: 'POST',
      body: JSON.stringify({
        taskId,
        history
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
    .then((response) => response.json())
    .then((res) => { 
      this.setState({
        history,
      });
      console.log(res);
    })
    .catch((err) => console.log(err));
  }

  saveHistory(record, taskId = this.props.id) {
    const history = this.state.history.slice();
    history.push(record);
    this.saveHistoryToServer(history, taskId);
  }

  deleteRecord(index, taskId = this.props.id) {
    const history = this.state.history.slice();
    if (index === 0) history.shift();
    else history.splice(index, 1);
    this.saveHistoryToServer(history, taskId);
  }

  render() {
    const taskTotal = this.calcTotal();
    return (
      <div className="task">
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
      tasksList: null,
      newTask: '',
    }
    this.textChangeHandler = this.textChangeHandler.bind(this);
    this.addTask = this.addTask.bind(this);
    this.getList = this.getList.bind(this);
  }

  getList() {
    fetch("/tasklist")
    .then((res) => res.json())
    .then(
      (result) => { this.setState({ tasksList: result.tasks }) }, 
      (error) => { console.log(error) },
    );
  }

  componentDidMount() {
    this.getList();
  }

  textChangeHandler(event){
    event.preventDefault();
    this.setState({ newTask: event.target.value });
  };

  addTask(event) {
    const newTask = this.state.newTask;
    fetch("/tasklist", {
      method: 'POST',
      body: JSON.stringify({
        name: newTask,
        history: []
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
    .then((response) => response.json())
    .then((res) => { 
      this.getList();
      console.log(res)
    })
    .catch((err) => console.log(err));

    this.setState({
      newTask: '',
    })
  }

  render() {
    const tasks = this.state.tasksList?.map((elem, index) => {
      return (
        <div key={index}>
          <Task task={elem} id={index}/>
        </div>
      )
    })
    return (
      <div>
        <div>
          <h2>My Timesheet</h2>
        </div>
        <div>
          {tasks}
          <div className="addInput">        
            <input
            type="text"
            placeholder="Add a new task!"
            value={this.state.newTask}
            onChange={this.textChangeHandler}
            />
            <button onClick={this.addTask}>Add!</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Tasklist;
