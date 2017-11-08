import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as ActionTypes from '../actions';
import ReactModal from 'react-modal';
import ReactLoading from 'react-loading';
import {getReadableDate} from "../utils/Helpers";

class Post extends Component{

  static popTypes = {
    post: PropTypes.object.isRequired,
    viewMode: PropTypes.string.isRequired,
    votePost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    fetchPostById: PropTypes.func.isRequired,
    onDeletePost: PropTypes.func
  };

  state = {
    isConfirmationModalOpen: false,
    postToDelete: null,
    isDeletingPost: false,
  };


  componentDidMount(){
    if(this.props.isFetching) this.props.fetchPostById(this.props.postId)
  };

  componentDidUpdate(){
    if(this.state.isDeletingPost){
      this.closeConfirmationModal(()=>{
        if('onDeletePost' in this.props) this.props.onDeletePost()
      });

    }
  }

  showConfirmationModal = (pid) =>{
    this.setState({
      isConfirmationModalOpen:true,
      postToDelete: pid
    })
  };

  deletePost(){
    this.setState({
      isDeletingPost: true
    });
    this.props.deletePost(this.state.postToDelete)
  }

  closeConfirmationModal(cb){
    this.setState({
      isConfirmationModalOpen:false,
      postToDelete: null,
      isDeletingPost: false
    }, cb)
  }

  render(){
    const {post, viewMode, votePost, isFetching} = this.props;
    const {isConfirmationModalOpen, isDeletingPost } = this.state;

    return(
      <div>

        {!isFetching && (
          <div>
            <Link style={{
              textDecoration: viewMode === 'overview' ? 'underline' :'none',
            }} to={`/${post.category}/${post.id}`}>{post.title}</Link>
            <button disabled={post.isVoting} onClick={() =>  votePost(post.id,'upVote')}>+</button>
            <button disabled={post.isVoting} onClick={() => votePost(post.id,'downVote')}>-</button>
            <button onClick={() => this.showConfirmationModal(post.id)}>Delete</button>
            {/*<button onClick={}>Edit</button>*/}
            <p>Author: {post.author} - Date: {getReadableDate(post.timestamp)} - Comments: {post.commentCount} - Score: {post.voteScore}</p>

            {viewMode === 'details' && (
              <div>
                <p>{post.body}</p>
              </div>
            )}
          </div>
        )}


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

const mapStateToProps = ({entities}, {postId}) => {
  const post = {...entities.posts.byId[postId]};
  return {
    post,
    isFetching: !post.hasOwnProperty('id')
  }
};

const mapDispatchToProps = (dispatch) => ({
  votePost: (postId, upOrDown) => dispatch(ActionTypes.votePost(postId, upOrDown)),
  deletePost: (postId) => dispatch(ActionTypes.deletePost(postId)),
  fetchPostById: (postId) => dispatch(ActionTypes.fetchPostById(postId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);