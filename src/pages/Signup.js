import React, {useState} from 'react';
import {db, signup} from '../firebase';
import {Link} from 'react-router-dom';


export default function Signup() {
  const [credentials, setCredentials] = useState({
    error: null,
    email: '',
    username: '',
    password: ''
  });

  // track email/password as state
  function handleChange(e) {
    setCredentials(credentials =>
      ({...credentials, [e.target.name]: e.target.value}));
  }

  // verify email/username is available & add user to DB
  async function handleSubmit(e) {
    e.preventDefault();
    setCredentials(credentials => ({...credentials, error: null}));

    // pull existing usernames & emails from db
    db.ref('users').once('value', snapshot => {
      let users = [];
      snapshot.forEach(user => {users.push(user.val())});

      const registeredEmails = users.map(user => user.email);
      const registeredUsernames = users.map(user => user.username);

      // if email & username avail., register new user + add info to db
      if (
        !registeredEmails.includes(credentials.email) &&
        !registeredUsernames.includes(credentials.username)) {
          if (credentials.username.length > 6) {
            signup(credentials.email, credentials.password)
            .then(user => {
              const userId = user.user.uid;
              db.ref(`users/${userId}`).set({
                email: credentials.email,
                username: credentials.username
              });
            })
            .catch(error => setCredentials(credentials => ({...credentials, error: error.message})))
          } else {
            setCredentials(credentials => ({...credentials, error: 'The username must be 6 characters long or more.'}));
          }
      }

      // error message (email)
      if (registeredEmails.includes(credentials.email)) {
        setCredentials(credentials => ({...credentials, error: "Email unavailable"}));
      }

      // error message (username)
      if (registeredUsernames.includes(credentials.username)) {
        setCredentials(credentials => ({...credentials, error: "Username unavailable"}));
      }

      // error message (email + username)
      if (
        registeredEmails.includes(credentials.email) &&
        registeredUsernames.includes(credentials.username)) {
          setCredentials(credentials => ({...credentials, error: "Username / Email unavailable"}))
      }
    });
  }

  return (
    <div>
      <h2>Sign Up!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter an email address"
          onChange={handleChange}
        />
        <br/><br/>
        <input
          type="text"
          name="username"
          placeholder="Enter a username"
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
        {credentials.error ? <p>{credentials.error}</p> : null}
        <button type="submit">Create an Account</button>
        <hr/>
        <p>
          Already have an account? | <span><Link to="/login">Login</Link></span>
        </p>
      </form>
    </div>
  );
}
