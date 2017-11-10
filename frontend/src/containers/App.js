import React, { Component } from 'react';
import './App.css';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Header from '../components/Header'
import PostsList from '../components/PostsList';
import PostDetails from '../components/PostDetails';
import Home from '../components/Home';
import Navigation from '../components/Navigation';



class App extends Component {

  render() {

    return (
      <div className="Root-cont">
        <Header/>
        <div className="App-content">
          <Navigation/>
          <div className="App">
            <Route exact path="/" component={Home}/>

            <Route exact path="/:category" component={PostsList}/>

            <Route path="/:category/:postId" component={PostDetails}/>
          </div>
        </div>
      </div>
    );
  }
}




// used withRouter to overcome update blocking
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
export default withRouter(connect()(App));
