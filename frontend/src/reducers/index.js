import * as ActionTypes from '../actions'
import { combineReducers } from 'redux';

const initialAppState = {
  entities: {
    posts: {},
    users: {},
    comments: {}
  },
  postsByCategory:{}
};

const entities = (state = initialAppState.entities, action) =>{
  switch (action.type){
    default:
      return state;
  }
};

const postsByCategory = (state = initialAppState.postsByCategory, action) => {
  switch (action.type){
    case ActionTypes.FETCH_CATEGORIES:
      return state;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  entities,
  postsByCategory
});

export default rootReducer;