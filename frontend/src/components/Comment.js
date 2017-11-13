import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as ActionTypes from '../actions';
import ReactLoading from 'react-loading';
import {getReadableDate} from "../utils/Helpers";
import { Button, Glyphicon, Modal } from 'react-bootstrap';
import EntityForm from './EntityForm';

class Comment extends Component{

  state = {
    isConfirmationModalOpen: false,
    isEditing: false
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

  closeConfirmationModal(cb){
    this.setState({
      isConfirmationModalOpen:false,
      isDeletingPost: false
    }, cb)
  }

  toggleEditModal(){
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing
    }))
  }

  render(){
    const {comment, vote} = this.props;
    const {isConfirmationModalOpen, isDeleting, isEditing } = this.state;

    return (
      <div className="Comment">
        <div className="Title-cont">
          <div className="Author-cont">
            <div className="fTitle">{comment.author}</div>
          </div>
          <div className="Action-cont" >
            <Button className="Action-btn" bsSize="xs" bsStyle="success" disabled={comment.isVoting} onClick={() =>  vote(comment.id,'upVote')}><Glyphicon glyph="arrow-up" /></Button>
            <Button className="Action-btn" bsSize="xs" bsStyle="danger" disabled={comment.isVoting} onClick={() => vote(comment.id,'downVote')}><Glyphicon glyph="arrow-down" /></Button>
            <Button className="Action-btn delete" bsSize="xs" onClick={() => this.showConfirmationModal(comment.id)}><Glyphicon glyph="trash" /></Button>
            <Button className="Action-btn" bsSize="xs" bsStyle="warning" onClick={() => this.toggleEditModal()}><Glyphicon glyph="pencil" /></Button>
          </div>
          <p className="Info-text">Date: {getReadableDate(comment.timestamp)} - Comments: {comment.commentCount} - Score: {comment.voteScore}</p>
          {/*<button onClick={}>Edit</button>*/}
        </div>

        <div className="Body-cont">
          <p>{comment.body}</p>
        </div>

        <Modal
          show={isConfirmationModalOpen}
          aria-labelledby="contained-modal-title"
          onHide={() => this.closeConfirmationModal()}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Confirmation</Modal.Title>
          </Modal.Header>
          {!isDeleting && (<Modal.Body style={{
            color: 'white'
          }}>
            Are you sure you want to delete this comment?. This action can not be undone.
          </Modal.Body>)}
          {!isDeleting && (<Modal.Footer>
            <Button onClick={() => this.closeConfirmationModal()}>Cancel</Button>
            <Button bsStyle="danger" onClick={() => this.deleteComment()}>Confirm</Button>
          </Modal.Footer>)}

          {isDeleting && (
            <ReactLoading className="Loading-cont" type="spinningBubbles" color='blue'/>
          )}

        </Modal>

        <Modal bsSize="large" aria-labelledby="contained-modal-title-sm"  show={isEditing} onHide={() => this.toggleEditModal()}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">EDIT COMMENT</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EntityForm
              onComplete={(() => this.toggleEditModal())}
              action="editComment"
              id={comment.id}/>
          </Modal.Body>
        </Modal>

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