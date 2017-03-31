import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/Tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.test = this.test.bind(this);
    this.state = {
      hideCompleted: false,
    };
  }

  handleChange() {
    const id = ReactDOM.findDOMNode(this.refs.textId).value;
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    
    this.setState({ id:id })
    this.setState({ text:text })
  }

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const id = ReactDOM.findDOMNode(this.refs.textId).value;
    
    if (id) {
      Meteor.call('tasks.update', id, text);
    }else{
      Meteor.call('tasks.insert', text);
    }
      
    this.setState({ id:"" });
    this.setState({ text:"" });

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  test(val){
    this.setState({text: val.text});
    this.setState({id: val._id});
    // console.log(val.text,"-----")
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      const showFavoriteButton = task.owner === currentUserId;
      
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
          showFavoriteButton={showFavoriteButton}
          test = {this.test}
        />
      );
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
          
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          {
            this.props.currentUser ? 
            <form role="form" className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <div className="form-group">
                <input
                  ref="textId"
                  type="hidden"
                  value= {this.state.id}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  ref="textInput"
                  placeholder="Type to add new tasks"
                  value= {this.state.text}
                  onChange= { this.handleChange.bind(this) }
                />
              </div>
            </form> :''
          }
        </header>
 
        <ul>
          { this.renderTasks() }
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('favorites');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);