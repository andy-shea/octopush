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

export function getError(state) {
  return state.users.error;
}
