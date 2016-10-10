import {render} from 'react-cornerstone/client';
import configureStore from './store';
import createRoutes from './routes';

const store = render({configureStore, createRoutes, mountTo: document.getElementById('app')});
const {protocol, host, port} = window.location;
const socket = io.connect(protocol + '//' + host + (port && ':' + port));
socket.on('octopush.action', action => store.dispatch(action));
