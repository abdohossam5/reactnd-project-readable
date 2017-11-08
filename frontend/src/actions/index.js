import * as Api from '../utils/Api'

export const FETCHING_CATEGORIES = 'FETCHING_CATEGORIES';
export const fetchingCategories = () => ({
  type: FETCHING_CATEGORIES
});

export const RECEIVED_CATEGORIES = 'RECEIVED_CATEGORIES';
export const receivedCategories = (data) => ({
  type: RECEIVED_CATEGORIES,
  data
});

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const fetchCategories = () => (dispatch, getState) => {
  if(!shouldFetchCategories(getState())) return;
  dispatch(fetchingCategories());
  return Api.getCategories().then((data) => {
    dispatch(receivedCategories(data))
  })

};

const shouldFetchCategories = (state) =>  !state.entities.categories.isFetching;

export const FETCHING_POSTS = 'FETCHING_POSTS';
export const fetchingPosts = () => ({
  type: FETCHING_POSTS
});

export const RECEIVED_POSTS = 'RECEIVED_POSTS';
export const receivedPosts = (category = '', data) => ({
  type: RECEIVED_POSTS,
  category,
  data
});

export const FETCH_POSTS = 'FETCH_POSTS';
export const fetchPosts = (category = null) => (dispatch, getState) => {
  if(!shouldFetchPosts(getState(), category)) return;
  dispatch(fetchingPosts());
  return Api.getPosts(category).then(({entities}) => {
    entities.posts = entities.posts || [];
    dispatch(receivedPosts(category, {entities}))
  })
};

const shouldFetchPosts = (state, category) => {
  if(category){
     return state.postsByCategory[category] ?
       (!state.postsByCategory[category].isFetching && !state.entities.posts.isFetching) :
       true
  }
  return !state.entities.posts.isFetching
};

export const VOTE_INITIATED = 'VOTE_INITIATED';
export const voteInitiated = (postId) => ({
  type: VOTE_INITIATED,
  postId
});

export const VOTE_COMPLETED = 'VOTE_COMPLETED';
export const voteCompleted = (data) => ({
  type: VOTE_COMPLETED,
  data
});

export const votePost = (postId, upOrDown) => (dispatch) => {
  dispatch(voteInitiated(postId));
  return Api.votePost(postId, upOrDown)
    .then((data) => dispatch(voteCompleted(data)))
};

export const DELETE_POST_COMPLETED = 'DELETE_POST_COMPLETED';
export const deleteCompleted = (data) => ({
  type: DELETE_POST_COMPLETED,
  data
});

export const deletePost = (postId) => (dispatch) => {
  return Api.deletePost(postId)
    .then((data) => dispatch(deleteCompleted(data)))
};