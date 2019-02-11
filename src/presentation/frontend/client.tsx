import {hydrate} from 'emotion'; // tslint:disable-line:no-implicit-dependencies
import {render} from 'react-cornerstone';
import App from './App';
import createRoutesConfig from './router/routes';
import configureStore from './store';
import {getAuthenticatedUser, getIsAuthenticated} from './users/selectors';

declare global {
  interface Window {
    __RAVEN__: string;
    __LOGROCKET__: string;
    __EMOTION_IDS__: string;
  }
}

let LogRocket: any;
if (process.env.NODE_ENV === 'production') {
  let Raven: any;
  if (window.__RAVEN__) {
    Raven = require('raven-js'); // tslint:disable-line:no-var-requires
    Raven.config(window.__RAVEN__).install();
  }
  if (window.__LOGROCKET__) {
    LogRocket = require('logrocket'); // tslint:disable-line:no-var-requires
    const setupLogRocketReact = require('logrocket-react'); // tslint:disable-line:no-var-requires
    LogRocket.init(window.__LOGROCKET__);
    setupLogRocketReact(LogRocket);
  }
  
  if (window.__RAVEN__ && window.__LOGROCKET__) {
    Raven.setDataCallback((data: any) => {
      data.extra.sessionURL = LogRocket.sessionURL;
      return data;
    });
  }
}

const middleware = [];
if (LogRocket) middleware.push(LogRocket.reduxMiddleware());
hydrate((window as any).__EMOTION_IDS__);
const {store, reload} = render(
  configureStore(true, middleware),
  createRoutesConfig,
  App,
  document.getElementById('app')
);

if (LogRocket) {
  const state = store.getState();
  if (getIsAuthenticated(state)) {
    const {id, name, email} = getAuthenticatedUser(state);
    LogRocket.identify(id, {name, email});
  }
}

const {protocol, host, port} = window.location;
const socket = (window as any).io.connect(protocol + '//' + host + (port && ':' + port));
socket.on('octopush.action', (action: any) => store.dispatch(action));

if ((module as any).hot) (module as any).hot.accept('./App', reload);
