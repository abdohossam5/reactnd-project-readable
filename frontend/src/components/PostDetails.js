import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Post from './Post';
import CommentsList from './CommentsList';

class PostDetails extends Component {

  onDeletePost(){
    // this.props.history.length > 1 ? this.props.history.go(-1)  : this.props.history.go('/')
    this.props.history.replace('/')
  }

  render(){
    const {postId} = this.props.match.params;

    return(
      <div>
        <Post
          postId={postId}
          location = {this.props.location}
          viewMode="details"
          onDeletePost = {() => this.onDeletePost()}
        />
        <hr/>
        <CommentsList
          postId={postId}
        />
      </div>
    )
  }
}

PostDetails.propTypes = {
  match: PropTypes.object.isRequired
};

export default connect()(PostDetails)