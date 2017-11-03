import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import {Route} from 'react-router-dom'



class App extends Component {
  componentDidMount(){

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Readable</h1>
        </header>

        <Route exact path="/" render={() => (
          <div>
            INSIDE APP BABY
          </div>
        )}/>

      </div>
    );
  }
}

export default App;
