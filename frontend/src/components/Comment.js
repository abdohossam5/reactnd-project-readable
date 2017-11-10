import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as ActionTypes from '../actions';
import ReactModal from 'react-modal';
import ReactLoading from 'react-loading';
import {getReadableDate} from "../utils/Helpers";
import { Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';

class Comment extends Component{

  state = {
    isConfirmationModalOpen: false
  };

  showConfirmationModal = () =>{
    this.setState({
      isConfirmationModalOpen:true
    })
  };

  deleteComment(){
    this.setState({
      isDeletingPost: true
    });
    this.props.deleteComment(this.props.comment.id)
  }

  render(){
    const {comment, vote} = this.props;
    const {isConfirmationModalOpen, isDeleting } = this.state;

    return (
      <div>
        <h4>{comment.author}</h4>
        <ButtonToolbar bsSize="xsmall" >
          <Button bsStyle="success" disabled={comment.isVoting} onClick={() =>  vote(comment.id,'upVote')}>+</Button>
          <Button bsStyle="danger" disabled={comment.isVoting} onClick={() => vote(comment.id,'downVote')}>-</Button>
          <Button onClick={() => this.showConfirmationModal(comment.id)}><Glyphicon glyph="remove-circle" /></Button>
        </ButtonToolbar>
        {/*<button onClick={}>Edit</button>*/}
        <p>Author: {comment.author} - Date: {getReadableDate(comment.timestamp)} - Comments: {comment.commentCount} - Score: {comment.voteScore}</p>


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
          {!isDeleting && (
            <div>
              <p>Are you sure you want to delete this Comment?. This action can not be undone.</p>
              <button onClick={() => this.closeConfirmationModal()}>CANCEL</button>
              <button onClick={() => this.deleteComment()}>Confirm</button>
            </div>
          )}

          {isDeleting && (
            <ReactLoading type="spinningBubbles" color='blue'/>
          )}

        </ReactModal>

      </div>
    )
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  vote: (id, option) => dispatch(ActionTypes.vote({id, option, entityType: 'comments'})),
  deleteComment: (id) => dispatch(ActionTypes.deleteEntity({id, entityType: 'comments'})),
});

export default connect(null, mapDispatchToProps)(Comment);