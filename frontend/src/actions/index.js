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

export const RECEIVED_POST_DETAILS = 'RECEIVED_POST_DETAILS';
export const receivedPostDetails = (postId, data) => ({
  type: RECEIVED_POST_DETAILS,
  postId,
  data
});

export const fetchPostById = (id) => (dispatch) => {
  return Api.getPostById(id)
    .then((data) => dispatch(receivedPostDetails(id, data)))
};

export const VOTE_INITIATED = 'VOTE_INITIATED';
export const voteInitiated = (id, entityType) => ({
  type: VOTE_INITIATED,
  id,
  entityType
});

export const VOTE_COMPLETED = 'VOTE_COMPLETED';
export const voteCompleted = (data, entityType) => ({
  type: VOTE_COMPLETED,
  data,
  entityType
});

export const vote = ({id, option, entityType}) => (dispatch) => {
  dispatch(voteInitiated(id, entityType));
  return Api.vote({id, option, entityType})
    .then((data) => dispatch(voteCompleted(data, entityType)))
};

export const DELETE_ENTITY_COMPLETED = 'DELETE_ENTITY_COMPLETED';
export const deleteCompleted = (id, entityType, data) => ({
  type: DELETE_ENTITY_COMPLETED,
  id,
  entityType,
  data
});

export const deleteEntity = ({id, entityType}) => (dispatch) => {
  return Api.deleteEntity({id, entityType})
    .then((data) => dispatch(deleteCompleted(id, entityType, data)))
};

export const FETCHING_POST_COMMENTS = 'FETCHING_POST_COMMENTS';
export const fetchingPostComments = (postId) => ({
  type: FETCHING_POST_COMMENTS,
  postId
});

export const RECEIVED_POST_COMMENTS = 'RECEIVED_POST_COMMENTS';
export const receivedPostComments = (postId, data) => ({
  type: RECEIVED_POST_COMMENTS,
  postId,
  data
});

export const fetchPostComments = (postId) => (dispatch, getState) => {
  if (!shouldFetchComments(getState(), postId)) return;
  dispatch(fetchingPostComments(postId));
  return Api.getPostComments(postId)
    .then(({entities}) => {
      entities.comments = entities.comments || [];
      dispatch(receivedPostComments(postId, {entities}))
    })
};

const shouldFetchComments = (state, postId) => {
    return state.commentsByPost[postId] ? !state.commentsByPost[postId].isFetching : true;
};

export const CREATING_ENTITY = "CREATING_ENTITY";
export const creatingEntity = (loadingAction, id) => ({
  type: CREATING_ENTITY,
  loadingAction,
  id
});

export const ENTITY_CREATED = 'ENTITY_CREATED';
export const entityCreated = (loadingAction, data) => ({
  type: ENTITY_CREATED,
  entityType: loadingAction === 'addPost' ? 'posts': 'comments',
  data
});

export const createEntity = (data) => (dispatch) => {
  const {loadingAction, category ='', id} = data;
  dispatch(creatingEntity(loadingAction, id));
  data.entityType = loadingAction === 'addPost' ? 'posts': 'comments';
  return Api.createEntity(data)
    .then(({entities}) => {
      dispatch(entityCreated(loadingAction, {entities, category}))
    })
};

export const EDITING_ENTITY = "EDITING_ENTITY";
export const editingEntity = (loadingAction, id) => ({
  type: EDITING_ENTITY,
  loadingAction,
  id
});

export const ENTITY_EDITED = 'ENTITY_EDITED';
export const entityEdited = (loadingAction, data) => ({
  type: ENTITY_EDITED,
  entityType: loadingAction === 'editPost' ? 'posts': 'comments',
  data
});


export const editEntity = (data) => (dispatch) => {
  const {loadingAction, category ='', id} = data;
  dispatch(editingEntity(loadingAction, id));
  data.entityType = loadingAction === 'editPost' ? 'posts': 'comments';
  return Api.editEntity(data)
    .then(({entities}) => {
      dispatch(entityEdited(loadingAction, {entities, category}))
    })
};