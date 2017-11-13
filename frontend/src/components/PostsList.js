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
    selectedCategory: ''
  };

  componentWillMount(){
    this.setState({
      selectedCategory: this.props.match && this.props.match.params && this.props.match.params.category
    })
  }
  
  componentDidMount(){
    this.setState((prevState, props) => ({
      selectedCategory: props.match && props.match.params && props.match.params.category,
      posts: sort(props.posts, prevState.sortBy),
      isFetching: props.posts.length === 0 && props.isFetching // no need to show loading if there is ady preloaded posts
    }), () => this.props.getPosts(this.state.selectedCategory));

  }

  componentWillReceiveProps(nextProps){
    const nextCategory = nextProps.match && nextProps.match.params && nextProps.match.params.category;
    const categoryChanged = this.state.selectedCategory !== (nextCategory);

    this.setState((prevState, props) => ({
      posts: sort(nextProps.posts, prevState.sortBy),
      isFetching: nextProps.isFetching && prevState.posts.length === 0,
      selectedCategory: nextProps.match && nextProps.match.params && nextProps.match.params.category
    }), () => {
      if(categoryChanged){
        this.props.getPosts(this.state.selectedCategory)
      }
    });
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
      <div>

        {!isFetching &&
        <div className="Post-list">
          <div className="Sort-cont">
            <div className="Sort-Title">Sort BY: </div>
            <select className="Select-control" value={sortBy} onChange={(e) => this.sortChange(e.target.value)}>
              <option value="timestamp">Date</option>
              <option value="voteScore">vote score</option>
            </select>
          </div>
          <div className="Posts-cont">{posts.map(p => (
              <Post
                key={p.id}
                postId={p.id}
                location = {this.props.location}
                viewMode="overview"
              />
          ))}</div>
        </div>
        }

        {!isFetching && posts.length === 0 && (
          <div className="placeHolder"> Be The First to Post</div>
        )}

        {isFetching && (
          <div className="Loading-cont">
            <ReactLoading type="spinningBubbles" color='#61DAF9'/>
          </div>
        )}

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