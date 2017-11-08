import uuid4 from 'uuid/v4';
import { normalize, schema } from 'normalizr';

// APi Constants
const token = localStorage.getItem('token') ||  uuid4();
localStorage.setItem('token', token);

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': token,
};

const api = 'http://localhost:3001';


// APP Schemas
const userSchema = new schema.Entity('users');
const categorySchema = new schema.Entity('categories', {}, {
  idAttribute: c => c.name
});
const postSchema = new schema.Entity('posts',{
  category: categorySchema,
  author: userSchema
});

// get All Categories
export const getCategories = () =>
  fetch(`${api}/categories`, {headers})
    .then(res => res.json())
    .then(({categories}) => normalize(categories, [categorySchema]));


// get Posts for a specific category or all categories
export const getPosts = (category = null) => {
  let url = category ? `${api}/${category}/posts` : `${api}/posts`;
  return fetch(url, {headers})
    .then(res => res.json())
    .then(posts => normalize(posts, [postSchema]))
};

// upVote or downVote a post
export const votePost = (postId, option) => {
  return fetch(`${api}/posts/${postId}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ option })
  })
    .then(res => res.json())
    .then(post => normalize(post, postSchema))
};

// delete a post (sets the deleted flag on the post and parent deleted on comments
export const deletePost = (postId) => {
  return fetch(`${api}/posts/${postId}`, {
    headers,
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(post => normalize(post, postSchema))
};