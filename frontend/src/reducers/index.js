import * as ActionTypes from '../actions'
import { combineReducers } from 'redux';

const initialAppState = {
  entities: {
    categories: { byId : {}, allIds : []},
    posts: { byId : {}, allIds : []},
    users: { byId : {}, allIds : []},
    comments: { byId : {}, allIds : []}
  },
  postsByCategory:{}
};

const entities = (state = initialAppState.entities, action) =>{
  switch (action.type){
    case ActionTypes.RECEIVED_CATEGORIES:
      return {
        ...state,
        categories:{
          ...state.categories,
          byId: action.data.entities.categories,
          allIds: Object.keys(action.data.entities.categories)
        }
      };
    case ActionTypes.RECEIVED_POSTS:
      return {
        ...state,
        posts:{
          ...state.posts,
          byId: action.data.entities.posts,
          allIds: Object.keys(action.data.entities.posts)
        }
      }
    default:
      return state;
  }
};

const postsByCategory = (state = initialAppState.postsByCategory, action) => {
  switch (action.type){
    case ActionTypes.FETCH_CATEGORIES:
      return state;
    case ActionTypes.RECEIVED_CATEGORIES:
      return {
        ...action.data.entities,
        ...state,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  entities,
  postsByCategory
});

export default rootReducer;