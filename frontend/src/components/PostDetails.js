import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Post from './Post';
import CommentsList from './CommentsList';
import EntityFrom from './EntityForm'

class PostDetails extends Component {

  onDeletePost(){
    // this.props.history.length > 1 ? this.props.history.go(-1)  : this.props.history.go('/')
    this.props.history.replace('/')
  }

  submitComment(data){
    console.log(data);
  }

  render(){
    const {postId} = this.props.match.params;

    return(
      <div className="Posts-cont">
        <Post
          postId={postId}
          location = {this.props.location}
          viewMode="details"
          onDeletePost = {() => this.onDeletePost()}
        />

        <CommentsList
          postId={postId}
        />

        <div className="Add-comment-cont">
          <div className="Title-cont">
            <div className="fTitle">Post Comment</div>
          </div>
          <EntityFrom
            fields={['author']}
            onSubmit={(data) => this.submitComment(data)}
          />
        </div>
      </div>
    )
  }
}

PostDetails.propTypes = {
  match: PropTypes.object.isRequired
};

export default connect()(PostDetails)