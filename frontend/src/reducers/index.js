import * as ActionTypes from '../actions'
import { combineReducers } from 'redux';

const initialAppState = {
  entities: {
    categories: { byId : {}, allIds : [], isFetching: false},
    posts: { byId : {}, allIds : [], isFetching: false},
    users: { byId : {}, allIds : []},
    comments: { byId : {}, allIds : []}
  },
  postsByCategory:{}
};

const entities = (state = initialAppState.entities, action) =>{
  switch (action.type){
    case ActionTypes.FETCHING_CATEGORIES:
      return {
        ...state,
        categories: {
          ...state.categories,
          isFetching: true
        }
      };
    case ActionTypes.RECEIVED_CATEGORIES:
      return {
        ...state,
        categories:{
          ...state.categories,
          byId: action.data.entities.categories,
          allIds: Object.keys(action.data.entities.categories),
          isFetching: false
        }
      };
    case ActionTypes.FETCHING_POSTS:
      if(!action.category){
        return {
          ...state,
          posts: {
            ...state.posts,
            isFetching: true
          }
        }
      }
      return state;
    case ActionTypes.RECEIVED_POSTS:
      if (!action.category) {
        return {
          ...state,
          posts: {
            ...state.posts,
            byId: action.data.entities.posts,
            allIds: Object.keys(action.data.entities.posts),
            isFetching: false
          }
        };
      } else {
        let newState = {
          ...state,
          posts: {
            ...state.posts,
            isFetching: false

          }
        };
        Object.keys(action.data.entities.posts).forEach(postId =>{
          if(newState.posts.allIds.indexOf(postId) < 0){
            newState.posts.allIds.push(postId);
            newState.posts.byId[postId] = action.data.entities.posts[postId];
          }
        });
        return newState;
      }
    case ActionTypes.VOTE_INITIATED:
      return {
        ...state,
        posts:{
          ...state.posts,
          byId: {
            ...state.posts.byId,
            [action.postId]: {
              ...state.posts.byId[action.postId],
              isVoting: true
            }
          }
        }
      };
    case ActionTypes.DELETE_POST_COMPLETED:
    case ActionTypes.VOTE_COMPLETED:
      return {
        ...state,
        posts:{
          ...state.posts,
          byId: {
            ...state.posts.byId,
            ...action.data.entities.posts
          }
        }
      };
    default:
      return state;
  }
};

const postsByCategory = (state = initialAppState.postsByCategory, action) => {
  switch (action.type){
    case ActionTypes.RECEIVED_CATEGORIES:
      let newState =  {
        ...state,
      };
      Object.keys(action.data.entities.categories).forEach((c) => {
        if(!newState.hasOwnProperty(c)) newState[c] = {items:[], isFetching: false}
      });
      return newState;
    case ActionTypes.FETCHING_POSTS:
      if(action.category){
        return {
          ...state,
          [action.category]:{
            ...state[action.category],
            isFetching: true
          }
        }
      }
      return state;
    case ActionTypes.RECEIVED_POSTS:
      if (action.category) {
        return {
          ...state,
          [action.category] : {
            items: Object.keys(action.data.entities.posts),
            isFetching: false
          }
        };
      } else {
        let newState = {...state};
        const posts = action.data.entities.posts;

        Object.keys(posts).forEach(postId =>{
          if(newState.hasOwnProperty(posts[postId].category)){
            if(newState[posts[postId].category].items.indexOf(postId) < 0){
              newState[posts[postId].category].items.push(postId)
            }
          } else {
            newState[posts[postId].category] = {
              items: [postId],
              isFetching: false
            }
          }
        });

        return newState;
      }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  entities,
  postsByCategory
});

export default rootReducer;