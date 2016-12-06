import {createSelector} from 'reselect';
import {getStackEditing, getCurrentStack} from '../stacks/selectors';

export function getServers(state) {
  return state.servers.map;
}

export function getServerEditing(state) {
  const {map, serverEditing} = state.servers;
  return map[serverEditing];
}

function mapStackServers({servers: serverIds}, servers) {
  return serverIds.reduce((map, id) => {
    map[id.toString()] = servers[id.toString()];
    return map;
  }, {});
}

export const getStackEditingServers = createSelector([getStackEditing, getServers], mapStackServers);

export const getCurrentStackServers = createSelector([getCurrentStack, getServers], (stack, servers) => stack && mapStackServers(stack, servers));

export const getStackEditingGroupedServers = createSelector([getStackEditing, getServers], ({servers: serverIds}, servers) => {
  return serverIds.map(id => servers[id.toString()]);
});

function getIsSaving(state) {
  return state.servers.isSaving;
}

function getError(state) {
  return state.servers.error;
}

export const getFormState = createSelector([getIsSaving, getError], (isSaving, error) => ({isSaving, error}));
