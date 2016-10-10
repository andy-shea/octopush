import React from 'react';
import {Route, IndexRoute} from 'react-router';
import AppContainer from './AppContainer';
import DeployContainer from './deploys/DeployContainer';
import LoginContainer from './users/LoginContainer';
import {RequiresAuth} from '../auth';
import {isAuthenticated} from './users/selectors';

function createRoutes(store) {
  const connect = fn => (nextState, replaceState) => fn(store, nextState, replaceState);
  const redirectAuthenticated = (nextState, replace) => {
    if (isAuthenticated(store.getState())) replace('/');
  };

  return (
    <Route path="/">
      <Route path="login" component={LoginContainer} onEnter={redirectAuthenticated}/>
      <Route component={AppContainer}>
        <IndexRoute component={RequiresAuth(DeployContainer)} onEnter={connect(RequiresAuth.onEnter)}/>
        <Route path=":stack" component={RequiresAuth(DeployContainer)} onEnter={connect(RequiresAuth.onEnter)}/>
      </Route>
    </Route>
  );
}

export default createRoutes;
