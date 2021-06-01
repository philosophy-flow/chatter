import './credentials.css';
import React, {useState} from 'react';
import {signin, resetPassword} from '../firebase';
import {Link} from 'react-router-dom';


export default function Signup() {
  const [credentials, setCredentials] = useState({
    error: null,
    email: '',
    password: ''
  });

  // track email/password as state
  function handleChange(e) {
    setCredentials(credentials => 
      ({...credentials, [e.target.name]: e.target.value})
    );
  }

  // authenticate existing user
  function handleSubmit(e) {
    e.preventDefault();
    setCredentials(credentials => ({...credentials, error: null}));

    signin(credentials.email, credentials.password)
    .catch(e => setCredentials(credentials => ({...credentials, error: e.message})));
  }

  // handle password reset
  function handleReset() {
    resetPassword(credentials.email);
  }

  return (
    <div className="Credential">
      <h2 className="credential-title">Login!</h2>
      <form className="credential-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Enter an email address"
          onChange={handleChange}
        />
        <br/><br/>
        <input
          type="password"
          name="password"
          placeholder="Enter a password"
          onChange={handleChange}
        />
        <br/><br/>
        {credentials.error
          ? (
            <div className="credential-error">
              <p>{credentials.error}</p>
              <p>
                Forgot password? | <button type="button" onClick={handleReset}>Reset Password</button>
              </p>
          </div>
          )
          : null}
        <button type="submit">Login</button>
      </form>
      <hr/>
      <p className="credential-footer">
        Don't have an account? | <span><Link className="Link" to="/signup">Sign Up</Link></span>
      </p>
    </div>
  );
}
