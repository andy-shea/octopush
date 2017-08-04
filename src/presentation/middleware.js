import {configureMiddleware} from 'react-cornerstone';
import {normalize} from 'normalizr';
import configureStore from './frontend/store';
import createRoutesConfig from './frontend/router/routes';
import {render} from './frontend/template';
import Router from './frontend/router/Router';
import Server from '~/domain/server/Server';
import ServerService from '~/application/ServerService';
import Stack from '~/domain/stack/Stack';
import StackService from '~/application/StackService';

async function loadStacksAndServers(injector) {
  const stacks = injector.get(StackService).loadStacks();
  const servers = injector.get(ServerService).loadServers();
  return {
    stacks: {map: normalize(await stacks, [Stack.normalizedSchema]).entities.stacks},
    servers: {map: normalize(await servers, [Server.normalizedSchema]).entities.servers}
  };
}

function userDetailsExtractor({id, email, name}) {
  return {id, email, name};
}

async function getInitialState({user, injector}) {
  if (user) {
    const userDetails = userDetailsExtractor(user);
    const id = user.id.toString();
    const stacksAndServers = await loadStacksAndServers(injector);
    return {
      users: {map: {[id]: userDetails}, authenticatedUser: id},
      ...stacksAndServers
    };
  }
  return {};
}

function getHelpers({injector}) {
  return {injector};
}

const middleware = configureMiddleware(configureStore, createRoutesConfig, Router, render, {getInitialState, getHelpers});

export default middleware;
