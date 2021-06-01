import './Home.css';
import chatSvg from '../speech-bubble.svg';
import React from 'react';
import {Link} from 'react-router-dom';


export default function Home() {
  return (
    <div className="Home">
      <img className="home-svg" src={chatSvg} alt="text-bubble"/>
      <h1 className="home-main-text">Welcome to Chatter</h1>
      <p className="home-sub-text">A simple chat room.</p>
      <div className="home-link-container">
        <Link className="Link" to="/signup">Signup</Link>
        <br/>
        <Link className="Link" to="/login">Login</Link>
      </div>
    </div>);
}
