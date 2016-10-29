import {createSelector} from 'reselect';
import {getUsers} from '../users/selectors';

export function getCurrentStackSlug(state) {
  return state.deploys.currentStackSlug;
}

export function getPagination(state) {
  return state.deploys.pagination;
}

function getDeploysMap(state) {
  return state.deploys.map;
}

export const getDeploys = createSelector([getDeploysMap, getPagination], (deploys, pagination) => {
  return pagination && pagination.deploys.map(id => deploys[id]);
});

export const getDeployUsers = createSelector([getDeploys, getUsers], (deploys, users) => {
  return deploys && deploys.reduce((map, deploy) => {
    map[deploy.id] = users[deploy.user];
    return map;
  }, {});
});

export function getBranches(state) {
  return state.deploys.branches;
}

export function getIsLoading(state) {
  return state.deploys.isLoading;
}

function getIsDeploying(state) {
  return state.deploys.isDeploying;
}

function getError(state) {
  return state.deploys.error;
}

export const getMeta = createSelector([getIsDeploying, getError], (isDeploying, error) => ({isSaving: isDeploying, error}));
