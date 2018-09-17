import {hydrate} from 'emotion'; // tslint:disable-line:no-implicit-dependencies
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import Raven from 'raven-js';
import {render} from 'react-cornerstone';
import App from './App';
import createRoutesConfig from './router/routes';
import configureStore from './store';
import {getAuthenticatedUser, getIsAuthenticated} from './users/selectors';

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://43d5e05d88164841a1cf72c071510ccc@sentry.io/1273065').install();
  LogRocket.init('0xjlmh/octopush-dev');
  setupLogRocketReact(LogRocket);
  Raven.setDataCallback(data => {
    data.extra.sessionURL = LogRocket.sessionURL;
    return data;
  });
}

hydrate((window as any).__EMOTION_IDS__);
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
const socket = (window as any).io.connect(protocol + '//' + host + (port && ':' + port));
socket.on('octopush.action', (action: any) => store.dispatch(action));

if ((module as any).hot) (module as any).hot.accept('./App', reload);
