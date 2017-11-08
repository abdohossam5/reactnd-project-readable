import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as ActionTypes from '../actions';
import ReactModal from 'react-modal';
import ReactLoading from 'react-loading';

class Post extends Component{

  static popTypes = {
    post: PropTypes.object.isRequired,
    viewMode: PropTypes.string.isRequired,
  };

  state = {
    isConfirmationModalOpen: false,
    postToDelete: null,
    isDeletingPost: false
  };

  componentDidUpdate(){
    if(this.state.isDeletingPost){
      this.closeConfirmationModal()
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

  closeConfirmationModal(){
    this.setState({
      isConfirmationModalOpen:false,
      postToDelete: null,
      isDeletingPost: false
    })
  }

  render(){
    const {post, viewMode, votePost} = this.props;
    const {isConfirmationModalOpen, isDeletingPost} = this.state;

    return(
      <div>
        <Link to="/">{post.title}</Link>
        <button disabled={post.isVoting} onClick={() =>  votePost(post.id,'upVote')}>+</button>
        <button disabled={post.isVoting} onClick={() => votePost(post.id,'downVote')}>-</button>
        <button onClick={() => this.showConfirmationModal(post.id)}>Delete</button>
        {/*<button onClick={}>Edit</button>*/}
        <p>Author: {post.author} - Comments: {post.commentCount} - Score: {post.voteScore}</p>

        {viewMode === 'details' && (
          <div>
            <p>{post.body}</p>
          </div>
        )}


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

const mapDispatchToProps = (dispatch) => ({
  votePost: (postId, upOrDown) => dispatch(ActionTypes.votePost(postId, upOrDown)),
  deletePost: (postId) => dispatch(ActionTypes.deletePost(postId))
});

export default connect(null, mapDispatchToProps)(Post);