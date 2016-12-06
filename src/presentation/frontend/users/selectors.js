import {createSelector} from 'reselect';

export function getUsers(state) {
  return state.users.map;
}

export function getAuthenticatedUser(state) {
  const {map, authenticatedUser} = state.users;
  return map[authenticatedUser];
}

export function isAuthenticated(state) {
  return !!state.users.authenticatedUser;
}

function getIsActioning(state) {
  return state.users.isActioning;
}

function getError(state) {
  return state.users.error;
}

export const getFormState = createSelector([getIsActioning, getError], (isActioning, error) => ({isActioning, error}));
