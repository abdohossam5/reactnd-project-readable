import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {sort} from "../utils/Helpers";
import ReactLoading from 'react-loading';
import * as ActionTypes from '../actions';
import ReactModal from 'react-modal';


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

  componentDidUpdate(){
    if(this.state.isDeletingPost){
      this.closeConfirmationModal()
    }
  }

  sortChange(sortBy){
    this.setState((prevState, props) => ({
      sortBy,
      posts: sort(prevState.posts, sortBy)
    }));
  }

  showConfirmationModal(pid){
    this.setState({
      isConfirmationModalOpen:true,
      postToDelete: pid
    })
  }

  deletePost(){
    this.setState({
      isDeletingPost: true
    });
    this.props.deletePost(this.state.postToDelete)
  }

  closeConfirmationModal(){
    this.setState({
      isConfirmationModalOpen:false,
      postToDelete: null,
      isDeletingPost: false
    })
  }

  render(){
    const {posts, sortBy, isFetching, isConfirmationModalOpen, isDeletingPost } = this.state;
    const {votePost} = this.props;
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
              <Link to="/">{p.title}</Link>
              <button disabled={p.isVoting} onClick={() => votePost(p.id, 'upVote')}>+</button>
              <button disabled={p.isVoting} onClick={() => votePost(p.id, 'downVote')}>-</button>
              <button onClick={() => this.showConfirmationModal(p.id)}>Delete</button>
              <button onClick={() => votePost(p.id, 'downVote')}>Edit</button>
              <p>Author: {p.author} - Comments: {p.commentCount} - Score: {p.voteScore}</p>
            </li>
          ))}</ul>
        </div>
        }

        {isFetching && <ReactLoading type="spinningBubbles" color='blue'/>}

        <ReactModal
          style={{
            content:{
              maxHeight: '100px',
              maxWidth: '50%',
              top: '25%',
              right: '25%',
              left: '25%'
            }
          }}
          isOpen = {isConfirmationModalOpen}
          contentLabel="Confirmation"
          onRequestClose={() => this.closeConfirmationModal()}
          shouldCloseOnOverlayClick={false}
        >
          {!isDeletingPost && (
            <div>
              <p>Are you sure you want to delete this post?. This action can not be undone.</p>
              <button onClick={() => this.closeConfirmationModal()}>CANCEL</button>
              <button onClick={() => this.deletePost()}>Confirm</button>
            </div>
          )}

          {isDeletingPost && (
            <ReactLoading type="spinningBubbles" color='blue'/>
          )}

        </ReactModal>

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
  getPosts: (category) => dispatch(ActionTypes.fetchPosts(category)),
  votePost: (postId, upOrDown) => dispatch(ActionTypes.votePost(postId, upOrDown)),
  deletePost: (postId) => dispatch(ActionTypes.deletePost(postId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);