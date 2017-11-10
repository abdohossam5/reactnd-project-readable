import React from 'react';

import PostsList from '../components/PostsList';


const Home = (props) => (
  <div>
    <PostsList location={props.location}/>
  </div>
);

export default Home