import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import Raven from 'raven-js';
import {hydrate} from 'emotion';
import {render} from 'react-cornerstone';
import {getIsAuthenticated, getAuthenticatedUser} from './users/selectors';
import configureStore from './store';
import createRoutesConfig from './router/routes';
import App from './App';

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://43d5e05d88164841a1cf72c071510ccc@sentry.io/1273065').install();
  LogRocket.init('0xjlmh/octopush-dev');
  setupLogRocketReact(LogRocket);
  Raven.setDataCallback(data => {
    data.extra.sessionURL = LogRocket.sessionURL;
    return data;
  });
}

hydrate(window.__EMOTION_IDS__);
const {store, reload} = render(
  configureStore(true),
  createRoutesConfig,
  App,
  document.getElementById('app')
);

const state = store.getState();
if (getIsAuthenticated(state)) {
  const {id, name, email} = getAuthenticatedUser(state);
  LogRocket.identify(id, {name, email});
}

const {protocol, host, port} = window.location;
const socket = io.connect(protocol + '//' + host + (port && ':' + port));
socket.on('octopush.action', action => store.dispatch(action));

if (module.hot) module.hot.accept('./App', reload);
