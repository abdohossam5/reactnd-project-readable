import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';


const Header = () => (
  <header className="App-header">
    <Link className="Logo-cont" to="/">
      <img src={logo} className="App-logo" alt="logo" />
      <p className="App-title">Readable</p>
    </Link>
  </header>
);

export default Header