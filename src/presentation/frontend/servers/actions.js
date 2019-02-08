import {get, post, del} from '~/infrastructure/fetch';
import action from '../action';
import Server from '~/domain/server/Server';
import Stack from '~/domain/stack/Stack';
import {asyncActionCreator, async, createTypes} from 'redux-action-creator';

export const types = createTypes(
  [
    ...async('LOAD_SERVERS'),
    ...async('ADD_SERVER'),
    ...async('UPDATE_SERVER'),
    ...async('REMOVE_SERVER')
  ],
  'SERVERS'
);

export const actions = {
  loadServers: asyncActionCreator(types.LOAD_SERVERS, {
    action: () => get('/api/servers'),
    schema: [Server.normalizedSchema]
  }),
  addServer: asyncActionCreator(types.ADD_SERVER, 'hostname', {
    action: action(payload => post('/api/servers', payload)),
    schema: Server.normalizedSchema
  }),
  updateServer: asyncActionCreator(types.UPDATE_SERVER, 'serverId', 'newHostname', {
    action: action(({serverId, ...payload}) => post(`/api/servers/${serverId}`, payload)),
    schema: Server.normalizedSchema
  }),
  removeServer: asyncActionCreator(types.REMOVE_SERVER, 'serverId', {
    action: ({serverId}) => del(`/api/servers/${serverId}`),
    schema: [Stack.normalizedSchema]
  })
};
