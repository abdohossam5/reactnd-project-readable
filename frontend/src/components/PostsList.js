import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {sort} from "../utils/Helpers";
import ReactLoading from 'react-loading';
import * as ActionTypes from '../actions';


class PostsList extends Component {

  state = {
    sortBy: 'timestamp',
    category : null,
    posts: [],
    isFetching: true
  };

  componentDidMount(){
    this.setState((prevState, props) => ({
      posts: props.posts,
      isFetching: props.posts.length === 0
    }));
    // this.props.getPosts(this.props.match ? this.props.match.params.category : '')
  }

  componentWillReceiveProps(nextProps){
    this.setState((prevState, props) => ({
      posts: nextProps.posts,
      isFetching: nextProps.posts.length === 0
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

const mapStateToProps = ({entities}, {match}) => (
  {
    posts : entities.posts.allIds.reduce((allPosts, pid) => {
      match && match.params && match.params.category ?
        (entities.posts.byId[pid].category === match.params.category ? allPosts.push(entities.posts.byId[pid]) : '')
        :
        allPosts.push(entities.posts.byId[pid]);
      return allPosts
    },[])
  }
);

const mapDispatchToProps = (dispatch) => ({
  getPosts: (category) => dispatch(ActionTypes.fetchPosts(category)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);