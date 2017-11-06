import React from 'react';
import CategoryList from '../components/CategoryList';
import PostsList from '../components/PostsList';


const Home = (props) => (
  <div>
    <CategoryList location={props.location}/>
    <hr/>
    <PostsList location={props.location}/>
  </div>
);

export default Home