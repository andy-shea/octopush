import {createSelector} from 'reselect';
import {getStackEditing, getCurrentStack} from '../stacks/selectors';

export function getServers(state) {
  return state.servers.map;
}

function mapStackServers({servers: serverIds}, servers) {
  return serverIds.reduce((map, id) => {
    map[id.toString()] = servers[id.toString()];
    return map;
  }, {});
}

export const getStackEditingServers = createSelector(
  [getStackEditing, getServers],
  mapStackServers
);

export const getCurrentStackServers = createSelector(
  [getCurrentStack, getServers],
  (stack, servers) => stack && mapStackServers(stack, servers)
);
