import * as ActionTypes from '../actions'
import { combineReducers } from 'redux';

const initialAppState = {
  entities: {
    categories: { byId : {}, allIds : [], isFetching: false},
    posts: { byId : {}, allIds : [], isFetching: false},
    users: { byId : {}, allIds : []},
    comments: { byId : {}, allIds : []}
  },
  postsByCategory:{}, // {react: {items:['postId', ...], isFetching:false}
  commentsByPost: {}, // {postId: {items:['commentId', ...], isFetching:false}
  stagingArea: {isLoading: false, loadingAction: '', items:[]}
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
    case ActionTypes.RECEIVED_POSTS:{
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
    }
    case ActionTypes.DELETE_ENTITY_COMPLETED:
      let newState = {...state};
      delete newState[action.entityType].byId[action.id];
      newState[action.entityType].allIds = newState[action.entityType].allIds.filter(id => id !== action.id);
      return newState;
    case ActionTypes.VOTE_INITIATED:
      return {
        ...state,
        [action.entityType]:{
          ...state[action.entityType],
          byId: {
            ...state[action.entityType].byId,
            [action.id]: {
              ...state[action.entityType].byId[action.id],
              isVoting: true
            }
          }
        }
      };
    case ActionTypes.VOTE_COMPLETED:
      return {
        ...state,
        [action.entityType]:{
          ...state[action.entityType],
          byId: {
            ...state[action.entityType].byId,
            ...action.data.entities[action.entityType]
          }
        }
      };
    case ActionTypes.RECEIVED_POST_DETAILS:{
      let newState = {
        ...state,
        posts:{
          ...state.posts,
          byId: {
            ...state.posts.byId,
            ...action.data.entities.posts
          }
        }
      };
      if(newState.posts.allIds.indexOf(action.postId) < 0) newState.posts.allIds.push(action.postId);
      return newState;
    }
    case ActionTypes.RECEIVED_POST_COMMENTS:
      return{
        ...state,
        comments:{
          ...state.comments,
          byId:{
            ...state.comments.byId,
            ...action.data.entities.comments
          },
          allIds: Object.keys(action.data.entities.comments).reduce((allIds,id)=>{
              if(allIds.indexOf(id) < 0) allIds.push(id);
              return allIds;
            },state.comments.allIds)
        }
      };
    case ActionTypes.ENTITY_EDITED:
    case ActionTypes.ENTITY_CREATED:
      const {entityType} = action;
      return {
        ...state,
        [entityType]:{
          ...state[entityType],
          byId:{
            ...state[entityType].byId,
            ...action.data.entities[entityType]
          },
          allIds: Object.keys(action.data.entities[entityType]).reduce((allIds,id)=>{
            if(allIds.indexOf(id) < 0) allIds.push(id);
            return allIds;
          },state[entityType].allIds)
        }
      };
    default:
      return state;
  }
};

const postsByCategory = (state = initialAppState.postsByCategory, action) => {
  switch (action.type){
    case ActionTypes.RECEIVED_CATEGORIES:{
      let newState =  {
        ...state,
      };
      Object.keys(action.data.entities.categories).forEach((c) => {
        if(!newState.hasOwnProperty(c)) newState[c] = {items:[], isFetching: false}
      });
      return newState;
    }
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
    case ActionTypes.RECEIVED_POST_DETAILS:{
      const postId = action.postId,
        postCategory = action.data.entities.posts[postId].category;
      return {
        ...state,
        [postCategory] : {
          ...state[postCategory],
          items: (state[postCategory] && state[postCategory].items) ?
            ( (state[postCategory].items.indexOf(postId) >= 0) ? (state[postCategory].items) : [...state[postCategory].items, postId])
             :
            ([postId])
        }
      };
    }
    case ActionTypes.DELETE_ENTITY_COMPLETED:
      if(action.entityType !== 'posts') return state;
      const postCategory = action.data.entities.posts[action.id].category;
      return {
        ...state,
        [postCategory]:{
          ...state[postCategory],
          items: state[postCategory].items.filter(id => id !== action.id)
        }
      };
    case ActionTypes.ENTITY_CREATED:{
      const {entityType} = action;
      if(entityType !== 'posts') return state;
      const postCategory = action.data.category;
      return {
        ...state,
        [postCategory]:{
          ...state[postCategory],
          items: [
            ...state[postCategory].items,
            ...Object.keys(action.data.entities.posts)
          ]
        }
      };
    }
    default:
      return state;
  }
};

const commentsByPost = (state = initialAppState.commentsByPost, action) => {
  switch (action.type){
    case ActionTypes.FETCHING_POST_COMMENTS:
      return{
        ...state,
        [action.postId]:{
          ...state[action.postId],
          items: state[action.postId]? (state[action.postId].items || []) : [],
          isFetching: true
        }
      };
    case ActionTypes.RECEIVED_POST_COMMENTS:
      return{
        ...state,
        [action.postId]:{
          ...state[action.postId],
          items: Object.keys(action.data.entities.comments).reduce((items,id)=>{
            if(items.indexOf(id) < 0) items.push(id);
            return items;
          }, state[action.postId]? (state[action.postId].items || []) : []),
          isFetching: false
        }
      };
    case ActionTypes.DELETE_ENTITY_COMPLETED:{
      if(action.entityType !== 'comments') return state;
      const postId = action.data.entities.comments[action.id].parentId;
      return {
        ...state,
        [postId]:{
          ...state[postId],
          items: state[postId].items.filter(id => id !== action.id)
        }
      };
    }
    case ActionTypes.ENTITY_CREATED:
      const {entityType} = action;
      if(entityType !== 'comments') return state;
      const commentId = Object.keys(action.data.entities.comments)[0];
      const postId = action.data.entities.comments[commentId].parentId;
      return {
        ...state,
        [postId]:{
          ...state[postId],
          items: [
            ...state[postId].items,
            ...Object.keys(action.data.entities.comments)
          ]
        }
      };
    default:
      return state;
  }
};

const stagingArea = ( state = initialAppState.stagingArea, action) => {
  switch (action.type){
    case ActionTypes.CREATING_ENTITY:
    case ActionTypes.EDITING_ENTITY:
      return {
        ...state,
        isLoading: true,
        loadingAction: action.loadingAction,
        items: [...state.items, action.id]
      };
    case ActionTypes.ENTITY_EDITED:
    case ActionTypes.ENTITY_CREATED:
      const entityId = Object.keys(action.data.entities[action.entityType])[0];
      return {
        ...state,
        isLoading: false,
        loadingAction: '',
        items: state.items.filter(id => id !== entityId)
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  entities,
  postsByCategory,
  commentsByPost,
  stagingArea
});

export default rootReducer;