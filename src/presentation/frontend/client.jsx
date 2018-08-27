import {render} from 'react-cornerstone';
import configureStore from './store';
import createRoutesConfig from './router/routes';
import App from './App';

const {store, reload} = render(configureStore, createRoutesConfig, App, document.getElementById('app'));
const {protocol, host, port} = window.location;
const socket = io.connect(protocol + '//' + host + (port && ':' + port));
socket.on('octopush.action', action => store.dispatch(action));

if (module.hot) module.hot.accept('./App', reload);
