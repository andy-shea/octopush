import {get, post, del} from '../utils/fetch';
import Server from '~/domain/server/Server';
import Stack from '~/domain/stack/Stack';
import {actionCreator, asyncActionCreator, async, createTypes} from 'redux-action-creator';

export const types = createTypes(
  [
    'EDIT_SERVER',
    ...async('LOAD_SERVERS'),
    ...async('ADD_SERVER'),
    ...async('UPDATE_SERVER'),
    ...async('REMOVE_SERVER')
  ],
  'SERVERS'
);

export const actions = {
  editServer: actionCreator(types.EDIT_SERVER, 'server'),
  loadServers: asyncActionCreator(types.LOAD_SERVERS, {
    client: () => get('/api/servers'),
    server: ({injector}) => {
      const ServerService = require('~/application/ServerService').default;
      return injector.get(ServerService).loadServers();
    },
    schema: [Server.normalizedSchema]
  }),
  addServer: asyncActionCreator(types.ADD_SERVER, 'hostname', {
    client: (payload, {resetForm, setErrors}) => {
      return post('/api/servers', payload).then(
        response => {
          resetForm();
          return response;
        },
        err => setErrors(err.response.data)
      );
    },
    schema: Server.normalizedSchema
  }),
  updateServer: asyncActionCreator(types.UPDATE_SERVER, 'serverId', 'newHostname', {
    client: ({serverId, ...payload}, {resetForm, setErrors}) => {
      return post(`/api/servers/${serverId}`, payload).then(
        response => {
          resetForm();
          return response;
        },
        err => setErrors(err.response.data)
      );
    },
    schema: Server.normalizedSchema
  }),
  removeServer: asyncActionCreator(types.REMOVE_SERVER, 'serverId', {
    client: ({serverId}) => del(`/api/servers/${serverId}`),
    schema: [Stack.normalizedSchema]
  })
};
