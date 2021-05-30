import React, {useState} from 'react';
import {db, signin, resetPassword} from '../firebase';
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

  // authenticate existing user + set presence
  function handleSubmit(e) {
    e.preventDefault();
    setCredentials(credentials => ({...credentials, error: null}));

    signin(credentials.email, credentials.password)
    .then(userCredential => {
      const userId = userCredential.user.uid;
      db.ref(`online/${userId}`).set(true);
    })
    .catch(error =>
      setCredentials(credentials => ({...credentials, error: 'Invalid username or password'}))
    );
  }

  // handle password reset
  function handleReset() {
    resetPassword(credentials.email);
  }

  return (
    <div>
      <h2>Login!</h2>
      <form onSubmit={handleSubmit}>
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
        {credentials.error
          ? (
            <>
              <p>{credentials.error}</p>
              <p>
                Forgot password? | <button type="button" onClick={handleReset}>Reset Password</button>
              </p>
          </>
          )
          : null}
        <br/><br/>
        <button type="submit">Login</button>
      </form>
      <hr/>
      <p>
        Don't have an account? | <span><Link to="/signup">Sign Up</Link></span>
      </p>
    </div>
  );
}
