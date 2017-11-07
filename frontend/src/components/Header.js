import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';


const Header = () => (
  <header className="App-header">
    <Link to="/">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Readable</h1>
    </Link>
  </header>
);

export default Header