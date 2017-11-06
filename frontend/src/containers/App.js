import React, { Component } from 'react';
import './App.css';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as ActionTypes from '../actions';
import Header from '../components/Header'
import PostsList from '../components/PostsList';
import Home from '../components/Home'



class App extends Component {

  componentDidMount(){
    this.props.getCategories();
    this.props.getPosts();
  };

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



const mapDispatchToProps = (dispatch) => ({
  getCategories: () => dispatch(ActionTypes.fetchCategories()),
  getPosts: (category) => dispatch(ActionTypes.fetchPosts(category)),
});

export default withRouter(connect(null, mapDispatchToProps)(App));
