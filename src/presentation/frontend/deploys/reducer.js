import produce from 'immer';
import {types} from './actions';
import {types as routerTypes} from '../router/routes';

export const initialState = {
  map: {}
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case routerTypes.STACK: {
      if (draft.currentStackSlug !== action.payload.stack) {
        return {
          map: {},
          pagination: undefined,
          branches: [],
          currentStackSlug: action.payload.stack,
          isLoading: true
        };
      }
      draft.map = {};
      if (draft.pagination) draft.pagination.deploys = [];
      draft.isLoading = true;
      break;
    }

    case routerTypes.STACK_SUCCESS: {
      const {
        result: {pagination, branches, slug},
        entities: {deploys}
      } = action.response;
      draft.map = deploys || {};
      draft.pagination = pagination;
      draft.branches = branches;
      draft.currentStackSlug = slug;
      draft.isLoading = false;
      break;
    }

    case routerTypes.STACK_FAIL:
      draft.isLoading = false;
      break;

    case types.TOGGLE_DEPLOY_DETAILS: {
      const {deploy} = action.payload;
      draft.map[deploy.id].isExpanded = !deploy.isExpanded;
      break;
    }

    case types.ADD_LOG_LINE: {
      const {deployId, line} = action.payload;
      draft.map[deployId].log += line;
      break;
    }

    case types.START_DEPLOY_SUCCESS: {
      const {result, entities} = action.response;
      const deploy = entities.deploys[result];
      deploy.isExpanded = true;
      deploy.log = '';
      draft.map[deploy.id] = deploy;
      const {pagination} = draft;
      const {deploys} = pagination;

      const ids = Object.keys(draft.map);
      if (ids.length > 9) {
        const removedId = ids.sort().shift();
        delete draft.map[removedId];
        const removedIndex = deploys.indexOf(parseInt(removedId, 10));
        if (removedIndex !== -1) deploys.splice(removedIndex, 1);
      }

      deploys.unshift(deploy.id);
      pagination.total++;
      pagination.totalPages = Math.ceil(pagination.total / pagination.limit);
      break;
    }

    case types.LOAD_LOG_SUCCESS:
      draft.map[action.payload.deployId].log = action.response;
  }
}, initialState);

export default reducer;
