import React, { PropTypes } from 'react';
import { Router, browserHistory } from 'react-router';

import Auth from './Auth';

class App extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    authStatus: {
      loggedIn: false,
      username: '',
      token: ''
    },
    trains: []
  };
    this.updateTrains = this.updateTrains.bind(this);
    this.updateAuthStatus = this.updateAuthStatus.bind(this);
  }

  fetchTrains() {
    fetch('http://localhost:3001/api/v1/trains')
    .then(response => response.json())
    .then(trains => {
      this.setState({ trains });
    })
    .catch(error => {
      console.log("Error Fetching Trains: ", error);
    });
  }

  componentDidMount() {
  let token = localStorage.getItem('token');
  let username = localStorage.getItem('username');

  if (token && username) {
    this.setState({
      authStatus: {
        loggedIn: true,
        username,
        token
      }
    })
  }

  this.fetchTrains();
}

  updateTrains(trains) {
    this.setState({ trains });
  }

  updateAuthStatus(authStatus, redirect) {
  this.setState({authStatus}, browserHistory.push(`/${redirect}/`));
}

login(event) {
  const { updateAuthStatus } = this.props;

  fetch('http://localhost:3001/authenticate', {
    method: 'POST',
    body: JSON.stringify(this.state),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response.json();
  })
  .then(({ username, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    updateAuthStatus({
      loggedIn: true,
      username,
      token
    }, 'admin');
  })
  .catch(error => {
    console.log('Error: ', error);
  });
}

  render () {
    const { trains } = this.state;

    return (
      <div>
        <h1>Big Metro City Choo-Choo Train Authority</h1>
        <Auth
          username={authStatus.username}
          updateAuthStatus={this.updateAuthStatus}
        />
      {React.cloneElement(
        this.props.children,
        {
          authStatus,
          updateAuthStatus: this.updateAuthStatus,
          trains,
          updateTrains: this.updateTrains
        }
      )}
      <button id="submit"
              onClick={event => this.login(event)}>Login
      </button>
       </div>
     )
   }
}

export default App;
