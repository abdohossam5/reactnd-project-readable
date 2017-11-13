import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as ActionTypes from '../actions';
import ReactLoading from 'react-loading';

class CategoryList extends Component {

  state = {
    isFetching: false,
    categories: []
  };

  componentDidMount(){
    this.setState((prevState, props) =>({
      categories: props.categories,
      isFetching: props.categories.length === 0 && props.isFetching // only display loading if there is no preloaded cat
    }));
    // load the categories every time component is loaded in case there are newly added ones
    this.props.getCategories();
  }

  componentWillReceiveProps(nextProps){
    this.setState((prevState, props) => ({
      categories: nextProps.categories,
      isFetching: nextProps.categories.length === 0 && nextProps.isFetching
    }));
  }

  render(){
    const {categories = [], isFetching} = this.state;
    const {location} = this.props;

    return (
      <div className="Nav-items-cont">

        {!isFetching ?
          ( <div className="Nav-items-cont">{categories.map(c => (
            <Link key={c} className={`Nav-item ${location.pathname.indexOf(c) >= 0 ? 'active': ''}`} to={`/${c}`}>{c}</Link>
          ))}</div>)
          :
          (<ReactLoading color="blue"/>)
        }

      </div>
    )
  }

}

const mapStateToProps = ({entities}) => (
  {
    categories: entities.categories.allIds,
    isFetching: entities.categories.isFetching
  }
);

const mapDispatchToProps = (dispatch) => ({
  getCategories: () => dispatch(ActionTypes.fetchCategories()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryList));