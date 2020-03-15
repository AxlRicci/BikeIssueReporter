import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Map from './components/Map';
import IssuesList from './components/IssuesList';
import { connect } from 'react-redux';
import { getIssuesThunk, getIssues } from './components/store';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Navbar/>
            <IssuesList />
          </div>
          <div>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/map' component={Map} issues={this.props.state}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

const mapState = (state) => ({
  state
})

const mapDispatch = dispatch => {
  dispatch(getIssuesThunk())
  return {
  }
}


export default connect(mapState, mapDispatch)(App);
