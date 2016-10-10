import {initialLoad} from 'react-cornerstone/server';
import {userDetailsExtractor} from './auth';
import configureStore from './frontend/store';
import createRoutes from './frontend/routes';
import {render} from './frontend/template';

function getInitialState({user}) {
  const initialState = {};
  if (user) {
    const userDetails = userDetailsExtractor(user);
    const id = user.id.toString();
    initialState.users = {map: {[id]: userDetails}, authenticatedUser: id};
  }
  return initialState;
}
function getHelpers({injector}) {
  return {injector};
}
const middleware = initialLoad({configureStore, createRoutes, render, getInitialState, getHelpers});

export default middleware;
