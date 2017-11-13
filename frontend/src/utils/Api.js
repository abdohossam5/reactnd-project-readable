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
const commentSchema = new schema.Entity('comments');

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
// get single post
export const getPostById = (id) => {
  return fetch(`${api}/posts/${id}`, {headers})
    .then(res => res.json())
    .then(post => normalize(post, postSchema))
};

// upVote or downVote a post/comment
export const vote = ({id, option, entityType}) => {
  return fetch(`${api}/${entityType}/${id}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ option })
  })
    .then(res => res.json())
    .then(entity => normalize(entity, entityType === 'posts'? postSchema : commentSchema))
};

// delete a post/comment (sets the deleted flag on the post/comment and parent deleted on comments
export const deleteEntity = ({id, entityType}) => {
  return fetch(`${api}/${entityType}/${id}`, {
    headers,
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => normalize(data, entityType === 'posts'? postSchema : commentSchema))
};

// get Comments for a specific post
export const getPostComments = (postId) => {
  return fetch(`${api}/posts/${postId}/comments`, {headers})
    .then(res => res.json())
    .then(comments => normalize(comments, [commentSchema]))
};

// create a post or comment
export const createEntity = (postData) => {
  const {entityType} = postData;
  return fetch(`${api}/${entityType}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      ...postData,
      timestamp: Date.now()
    })
  })
    .then(res => res.json())
    .then(data => normalize(data, entityType === 'posts'? postSchema : commentSchema))
};

// edit a post or a comment
export const editEntity = (postData) => {
  const {entityType, body, title} = postData;
  return fetch(`${api}/${entityType}/${postData.id}`, {
    headers,
    method: 'PUT',
    body: JSON.stringify({
      body,
      title,
      timestamp: Date.now()
    })
  })
    .then(res => res.json())
    .then(data => normalize(data, entityType === 'posts'? postSchema : commentSchema))
};