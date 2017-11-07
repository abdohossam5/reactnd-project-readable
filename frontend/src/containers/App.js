import React, { Component } from 'react';
import './App.css';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Header from '../components/Header'
import PostsList from '../components/PostsList';
import Home from '../components/Home'



class App extends Component {

  render() {

    return (
      <div className="App">

        <Header/>

        <Route exact path="/" component={Home}/>

        <Route path="/:category" component={PostsList}/>

      </div>
    );
  }
}




// used withRouter to overcome update blocking
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
export default withRouter(connect()(App));
