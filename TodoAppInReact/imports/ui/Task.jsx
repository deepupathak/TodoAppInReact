import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import classnames from 'classnames';
import ReactEmoji from '/src/react-emoji';

import { Tasks } from '../api/Tasks.js';

// Task component - represents a single todo item
export default class Task extends Component {
	toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }
 
  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  toggleFavorite() {
    Meteor.call('tasks.setFavorite', this.props.task._id, ! this.props.task.favorite);
  }

  render() {
    
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
      favorite: this.props.task.favorite,
    });

    return (
      <li>
      	<button className="delete" onClick={this.deleteThisTask.bind(this)}>
          <i className="fa fa-trash-o" aria-hidden="true"></i>
        </button>
 
        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { 
          this.props.showPrivateButton ? (
            <button className="toggle-private btn btn-default" onClick={this.togglePrivate.bind(this)}>
              { 
                this.props.task.private ? 'Private' : 'Public' 
              }
            </button>
          ) : ''
        }

        {
          this.props.showFavoriteButton ? (
            <button className="toggle-favorite btn btn-default" onClick={this.toggleFavorite.bind(this)}>
              {
                this.props.task.favorite ? 'Favorite' : 'Not Favorite'
              }
            </button>
          ) : ''
        }

        {
          this.props.currentUser ?
          <button className="btn btn-success" onClick={() => {this.props.test(this.props.task)}}>
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </button> : ''
        }
 
        <span className="text"><strong>{this.props.task.username}</strong>: {ReactEmoji.emojify(this.props.task.text)}</span>

      </li>
    );
  }
}
 
Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
  showFavoriteButton: React.PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, Task);