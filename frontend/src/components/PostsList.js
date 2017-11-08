import React, { Component } from 'react';
import {connect} from 'react-redux';
import {sort} from "../utils/Helpers";
import ReactLoading from 'react-loading';
import * as ActionTypes from '../actions';
import Post from './Post'


class PostsList extends Component {

  state = {
    sortBy: 'voteScore',
    posts: [],
    isFetching: true,
    selectedCategory: '',
    isConfirmationModalOpen: false,
    postToDelete: null,
    isDeletingPost: false
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

  render(){
    const {posts, sortBy, isFetching } = this.state;
    return (
      <div style={{
        alignItems: 'center',
        margin: 'auto'
      }}>

        {!isFetching &&
        <div>
          <select value={sortBy} onChange={(e) => this.sortChange(e.target.value)}>
            <option value="timestamp">Date</option>
            <option value="voteScore">vote score</option>
          </select>
          <ul>{posts.map(p => (
            <li key={p.id}>
              <Post
                postId={p.id}
                location = {this.props.location}
                viewMode="overview"
              />
            </li>
          ))}</ul>
        </div>
        }

        {isFetching && <ReactLoading type="spinningBubbles" color='blue'/>}

      </div>
    )
  }

}

const mapStateToProps = ({entities, postsByCategory}, {match}) => {
  const category = match && match.params && match.params.category;
  const postsIds = category ? (postsByCategory[category] ? postsByCategory[category].items : []) : entities.posts.allIds;
  return {
    posts:  postsIds.reduce((posts, id) => {
      if(!entities.posts.byId[id].deleted) posts.push({...entities.posts.byId[id]});
      return posts
    },[]),
    isFetching: category ? (postsByCategory[category] ? postsByCategory[category].isFetching : true) : entities.posts.isFetching
  }
};

const mapDispatchToProps = (dispatch) => ({
  getPosts: (category) => dispatch(ActionTypes.fetchPosts(category))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);