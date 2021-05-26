import React from 'react';
import {Link} from 'react-router-dom';


export default function Home() {
  return (
    <div>
      <h1>Welcome to Chatter</h1>
      <p>A simple chat room</p>
      <div>
        <Link to="/signup">Signup</Link>
        <br/>
        <Link to="/login">Login</Link>
      </div>
    </div>);
}
