import {createSelector} from 'reselect';
import {getCurrentStackSlug} from '../deploys/selectors';
import {isAuthenticated} from '../users/selectors';

export function isLoaded(state) {
  return state.stacks.loaded;
}

export function getStacks(state) {
  const {map} = state.stacks;
  return Object.keys(map).length ? map : undefined;
}

export function getStackEditing(state) {
  const {stacks: {map, stackEditing}} = state;
  return (stackEditing !== true) ? map[stackEditing] : {
    title: '',
    gitPath: '',
    servers: [],
    diff: ''
  };
}

export const getCurrentStack = createSelector([getCurrentStackSlug, getStacks], (slug, stacks) => stacks && stacks[slug]);

export function getGroupEditing(state) {
  return state.stacks.groupEditing;
}

export const shouldLoadStacks = createSelector([isAuthenticated, isLoaded], (authenticated, loaded) => authenticated && !loaded);

function getStackIsSaving(state) {
  return state.stacks.stackIsSaving;
}

function getStackError(state) {
  return state.stacks.stackError;
}

function getGroupIsSaving(state) {
  return state.stacks.groupIsSaving;
}

function getGroupError(state) {
  return state.stacks.groupError;
}

export const getStackMeta = createSelector([getStackIsSaving, getStackError], (isSaving, error) => ({isSaving, error}));
export const getGroupMeta = createSelector([getGroupIsSaving, getGroupError], (isSaving, error) => ({isSaving, error}));
