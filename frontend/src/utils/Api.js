import uuid4 from 'uuid/v4';
import { normalize, schema } from 'normalizr';

// APi Constants
const token = uuid4();

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
export const votePost = (postId, action) => {
  return fetch(`${api}/posts/${postId}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ option: action })
  })
    .then(res => res.json())
    .then(post => normalize(post, postSchema))
};