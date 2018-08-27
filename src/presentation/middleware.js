import React from 'react';
import {renderToString} from 'react-dom/server';
import {ServerStyleSheet} from 'styled-components';
import {Provider} from 'react-redux';
import {NOT_FOUND} from 'redux-first-router';
import {normalize} from 'normalizr';
import configureStore from './frontend/store';
import createRoutesConfig from './frontend/router/routes';
import {render} from './frontend/template';
import App from './frontend/App';
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

async function middleware(req, res, next) {
  try {
    const initialState = getInitialState ? await getInitialState(req) : {};
    const helpers = getHelpers ? getHelpers(req) : {};
    const routesConfig = {
      ...createRoutesConfig(helpers),
      initialEntries: [req.url]
    };
    const {store, thunk} = configureStore(false, routesConfig, initialState, req);
    await thunk(store);

    const {type, kind, pathname, search} = store.getState().location;
    let status = 200;
    if (type === NOT_FOUND) status = 404;
    else if (kind === 'redirect') {
      return res.redirect(302, search ? pathname + '?' + search : pathname);
    }

    const sheet = new ServerStyleSheet();
    const html = renderToString(
      sheet.collectStyles(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    res.status(status).send(render(html, store.getState(), sheet));
  }
  catch (err) {
    next(err);
  }
}

export default middleware;
