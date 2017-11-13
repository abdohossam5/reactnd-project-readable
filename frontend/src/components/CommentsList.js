import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {sort} from "../utils/Helpers";
import ReactLoading from 'react-loading';
import * as ActionTypes from '../actions';
import Comment from './Comment'


class CommentsList extends Component {

  state = {
    postId: null,
    sortBy: 'voteScore',
    comments: [],
    isFetching: true,
    selectedCategory: ''
  };

  componentWillMount(){
    this.setState({
      postId: this.props.postId
    })
  }

  componentDidMount(){
    this.setState((prevState, props) => ({
      comments: sort(props.comments, prevState.sortBy),
      isFetching: props.comments.length === 0 && props.isFetching // no need to show loading if there is ady preloaded posts
    }));
    this.props.getPostComments(this.state.postId)
  }

  componentWillReceiveProps(nextProps){
    this.setState((prevState, props) => ({
      comments: sort(nextProps.comments, prevState.sortBy),
      isFetching: nextProps.isFetching && prevState.comments.length === 0
    }));
  }

  sortChange(sortBy){
    this.setState((prevState, props) => ({
      sortBy,
      comments: sort(prevState.comments, sortBy)
    }));
  }

  render(){
    const {comments, sortBy, isFetching } = this.state;
    return (
      !isFetching ?
        (<div className="Comments-list">

          <div className="Header-cont">
            <div className="Title-cont">Comments:</div>
            <div className="Action-Cont">
              <div className="Action-Title">Sort By:</div>
              <select className="Select-control" value={sortBy} onChange={(e) => this.sortChange(e.target.value)}>
                <option value="timestamp">Date</option>
                <option value="voteScore">vote score</option>
              </select>
            </div>
          </div>

          {comments.length && (<div className="Comments-cont">{comments.map(c => (
            <Comment
              key={c.id}
              comment={c}
            />
          ))}</div>)}
          {comments.length === 0 && (
            <div className="placeHolder"> Be The First to Comment</div>
          )}
        </div>) :
        (<ReactLoading type="spinningBubbles" color='blue'/>)
    )
  }
}

CommentsList.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired
};

const mapStateToProps = ({entities, commentsByPost}, {postId}) => {
  const commentsIds = commentsByPost[postId] ? commentsByPost[postId].items : [];
  return {
    comments: commentsIds.reduce((comments,id)=>{
      if(!entities.comments.byId[id].deleted) comments.push({...entities.comments.byId[id]});
      return comments
    }, []),
    isFetching: commentsByPost[postId] ? commentsByPost[postId].isFetching : true
  }
};

const mapDispatchToProps = (dispatch) => ({
  getPostComments: (postId) => dispatch(ActionTypes.fetchPostComments(postId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList);