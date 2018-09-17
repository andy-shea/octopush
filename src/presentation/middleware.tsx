import {Injector} from '@angular/core';
import {all} from 'awaity/esm';
import {extractCritical} from 'emotion-server';
import {Request, RequestHandler} from 'express';
import {normalize} from 'normalizr';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {NOT_FOUND} from 'redux-first-router'; // tslint:disable-line:no-implicit-dependencies
import {ServerStyleSheet} from 'styled-components';
import ServerService from '~/application/ServerService';
import StackService from '~/application/StackService';
import Server from '~/domain/server/Server';
import Stack from '~/domain/stack/Stack';
import User from '~/domain/user/User';
import App from './frontend/App';
import createRoutesConfig from './frontend/router/routes';
import configureStore from './frontend/store';
import {render} from './frontend/template';

async function loadStacksAndServers(injector: Injector) {
  const [stacks, servers] = await all([
    injector.get(StackService).loadStacks(),
    injector.get(ServerService).loadServers()
  ]);
  return {
    stacks: {map: normalize(stacks, [(Stack as any).normalizedSchema]).entities.stacks},
    servers: {map: normalize(servers, [(Server as any).normalizedSchema]).entities.servers}
  };
}

function userDetailsExtractor({id, email, name}: User) {
  return {id, email, name};
}

async function getInitialState({user, injector}: Request) {
  if (user) {
    const userDetails = userDetailsExtractor(user);
    const id = (user.id as number).toString();
    const stacksAndServers = await loadStacksAndServers(injector);
    return {
      users: {map: {[id]: userDetails}, authenticatedUser: id},
      ...stacksAndServers
    };
  }
  return {};
}

function getHelpers({injector}: any) {
  return {injector};
}

const middleware: RequestHandler = async (req, res, next) => {
  try {
    const initialState = getInitialState ? await getInitialState(req) : {};
    const helpers = getHelpers ? getHelpers(req) : {};
    const routesConfig = {
      ...createRoutesConfig(helpers),
      initialEntries: [req.url]
    };
    const {store, thunk} = configureStore(false)(false, routesConfig, initialState, req);
    await thunk(store);

    const {type, kind, pathname, search} = store.getState().location;
    let status = 200;
    if (type === NOT_FOUND) status = 404;
    else if (kind === 'redirect') {
      return res.redirect(302, search ? pathname + '?' + search : pathname);
    }

    const sheet = new ServerStyleSheet();
    const {html, ids, css} = extractCritical(
      renderToString(
        sheet.collectStyles(
          <Provider store={store}>
            <App />
          </Provider>
        )
      )
    );
    res.status(status).send(render(html, store.getState(), sheet, ids, css));
  }
  catch (err) {
    next(err);
  }
};

export default middleware;
