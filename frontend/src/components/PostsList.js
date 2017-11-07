import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {sort} from "../utils/Helpers";
import ReactLoading from 'react-loading';
import * as ActionTypes from '../actions';


class PostsList extends Component {

  state = {
    sortBy: 'voteScore',
    posts: [],
    isFetching: true,
    selectedCategory: ''
  };

  componentWillMount(){
    this.setState({
      selectedCategory: this.props.match && this.props.match.params && this.props.match.params.category
    })
  }

  componentDidMount(){
    this.setState((prevState, props) => ({
      posts: sort(props.posts, prevState.sortBy),
      isFetching: props.posts.length === 0 && props.isFetching // no need to show loading if there is ady preloaded posts
    }));
    this.props.getPosts(this.state.selectedCategory)
  }

  componentWillReceiveProps(nextProps){
    this.setState((prevState, props) => ({
      posts: sort(nextProps.posts, prevState.sortBy),
      isFetching: nextProps.isFetching && prevState.posts.length === 0
    }));
  }

  sortChange(sortBy){
    this.setState((prevState, props) => ({
      sortBy,
      posts: sort(prevState.posts, sortBy)
    }));
  }
  vote(postId, action){

  }

  render(){
    const {posts, sortBy, isFetching } = this.state;
    return (
      <div style={{
        alignItems: 'center',
        margin: 'auto'
      }}>

        {!isFetching ?
          <div>
            <select value={sortBy} onChange={(e) => this.sortChange(e.target.value)}>
              <option value="timestamp">Date</option>
              <option value="voteScore">vote score</option>
            </select>
            <ul>{posts.map(p => (
              <li key={p.id}>
                <Link to="/">{p.title}</Link> <button onClick={() => this.vote(p.id, 'upVote')}>+</button> <button onClick={() => this.vote(p.id, 'downVote')}>-</button>
                <p>Author: {p.author} - Comments: {p.commentCount} - Score: {p.voteScore}</p>
              </li>
            ))}</ul>
          </div>

          :
          <ReactLoading type="spinningBubbles" color='blue'/>}
      </div>
    )
  }

}

const mapStateToProps = ({entities, postsByCategory}, {match}) => {
  const category = match && match.params && match.params.category;
  const postsIds = category ? (postsByCategory[category] ? postsByCategory[category].items : []) : entities.posts.allIds;
  return {
    posts:  postsIds.map(id => ({...entities.posts.byId[id]}) ),
    isFetching: category ? (postsByCategory[category] ? postsByCategory[category].isFetching : true) : entities.posts.isFetching
  }
};

const mapDispatchToProps = (dispatch) => ({
  getPosts: (category) => dispatch(ActionTypes.fetchPosts(category)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);