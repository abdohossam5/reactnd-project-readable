import * as Api from '../utils/Api'

export const RECEIVED_CATEGORIES = 'RECEIVED_CATEGORIES';
export const receivedCategories = (data) => ({
  type: RECEIVED_CATEGORIES,
  data
});

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const fetchCategories = () => (dispatch) => {
  return Api.getCategories().then((data) => {
    dispatch(receivedCategories(data))
  })
};


export const RECEIVED_POSTS = 'RECEIVED_POSTS';
export const receivedPosts = (data) => ({
  type: RECEIVED_POSTS,
  data
});

export const FETCH_POSTS = 'FETCH_POSTS';
export const fetchPosts = (category = null) => (dispatch) => {
  console.log(category);
  return Api.getPosts(category).then((data) => {
    dispatch(receivedPosts(data))
  })
};