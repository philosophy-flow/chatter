// IMPORT DEPENDENCIES
import React, {useState, useEffect} from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';
import {auth} from './firebase.js';

// IMPORT PATHS
import Home from './pages/Home';
import Chat from './pages/Chat';
import Signup from './pages/Signup';
import Login from './pages/Login';



// Higher Order Components
function PrivateRoute({component: Component, path, authenticated}) {
  return (
    <Route path={path}>
      {
        authenticated === true
        ? <Component />
        : <Redirect to='./login' />
      }
    </Route>
  );
}

function PublicRoute({component: Component, path, authenticated}) {
  return (
    <Route path={path}>
      {
        authenticated === false
        ? <Component />
        : <Redirect to='./chat' />
      }
    </Route>
  );
}



function App() {
  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    loading: true
  });


  // set up listener for authentication status change w/ firebase api
  // if no current user is authenticated, => user = null
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setAuthStatus({authenticated: true, loading: false})
      } else {
        setAuthStatus({authenticated: false, loading: false})
      }
    });
  }, []);


  return authStatus.loading === true ? <h2>Loading...</h2> : (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <PrivateRoute
          path="/chat"
          authenticated={authStatus.authenticated}
          component={Chat}
        />
        <PublicRoute
          path="/signup"
          authenticated={authStatus.authenticated}
          component={Signup}
        />
        <PublicRoute
          path="/login"
          authenticated={authStatus.authenticated}
          component={Login}
        />
      </Switch>
    </Router>
  );
}

export default App;
