export function getUsers(state) {
  return state.users.map;
}

export function getAuthenticatedUser(state) {
  const {map, authenticatedUser} = state.users;
  return map[authenticatedUser];
}

export function getIsAuthenticated(state) {
  return !!state.users.authenticatedUser;
}

export function getRedirectPath(state) {
  return (state.location.query && state.location.query.redirect) || '/';
}
