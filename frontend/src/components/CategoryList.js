import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class CategoryList extends Component {


  render(){
    const {categories = []} = this.props;
    return (
      <div>
        <ul>{categories.map(c => (
          <li key={c}><Link to={`/${c}`}>{c}</Link></li>
        ))}</ul>
      </div>
    )
  }

}

const mapStateToProps = ({entities}) => (
  {
    categories: entities.categories.allIds,
  }
);


export default connect(mapStateToProps)(CategoryList);