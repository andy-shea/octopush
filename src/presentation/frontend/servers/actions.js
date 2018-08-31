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
    client: async (payload, {resetForm, setErrors}) => {
      try {
        const response = await post('/api/servers', payload);
        resetForm();
        return response;
      }
      catch (error) {
        setErrors(error.response.data);
      }
    },
    schema: Server.normalizedSchema
  }),
  updateServer: asyncActionCreator(types.UPDATE_SERVER, 'serverId', 'newHostname', {
    client: async ({serverId, ...payload}, {resetForm, setErrors}) => {
      try {
        const response = await post(`/api/servers/${serverId}`, payload);
        resetForm();
        return response;
      }
      catch (error) {
        setErrors(error.response.data);
      }
    },
    schema: Server.normalizedSchema
  }),
  removeServer: asyncActionCreator(types.REMOVE_SERVER, 'serverId', {
    client: ({serverId}) => del(`/api/servers/${serverId}`),
    schema: [Stack.normalizedSchema]
  })
};
