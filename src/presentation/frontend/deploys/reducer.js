import {types} from './actions';
import {types as routerTypes} from '../router/routes';

function updateDeploy(state, deployId, prop, value) {
  const nextDeploys = {...state.map};
  nextDeploys[deployId] = {...nextDeploys[deployId], [prop]: value};
  return {...state, map: nextDeploys};
}

function reducer(state = {map: {}}, action) {
  switch (action.type) {
    case routerTypes.STACK: {
      if (state.currentStackSlug !== action.payload.stack) {
        return {
          map: {},
          pagination: undefined,
          branches: [],
          currentStackSlug: action.payload.stack,
          isLoading: true
        };
      }
      return {...state, map: {}, pagination: {...state.pagination, deploys: []}, isLoading: true};
    }

    case routerTypes.STACK_SUCCESS: {
      const {
        result: {pagination, branches, slug},
        entities: {deploys}
      } = action.response;
      return {
        ...state,
        map: deploys,
        pagination,
        branches,
        currentStackSlug: slug,
        isLoading: false
      };
    }

    case routerTypes.STACK_FAIL:
      return {...state, isLoading: false};

    case types.TOGGLE_DEPLOY_DETAILS:
      const {deploy} = action.payload;
      return updateDeploy(state, deploy.id, 'isExpanded', !deploy.isExpanded);

    case types.ADD_LOG_LINE: {
      const {deployId, line} = action.payload;
      const nextDeploys = {...state.map};
      nextDeploys[deployId] = {...nextDeploys[deployId]};
      nextDeploys[deployId].log += line;
      return {...state, map: nextDeploys};
    }

    case types.START_DEPLOY_SUCCESS: {
      const {
        result,
        entities: {deploys}
      } = action.response;
      const deploy = deploys[result];
      deploy.isExpanded = true;
      deploy.log = '';
      const nextMap = {...state.map, [deploy.id]: deploy};
      const nextPagination = {...state.pagination};

      const ids = Object.keys(nextMap);
      if (ids.length > 9) {
        const removedId = ids.sort().shift();
        delete nextMap[removedId];
        const removedIndex = nextPagination.deploys.indexOf(parseInt(removedId, 10));
        if (removedIndex !== -1) nextPagination.deploys.splice(removedIndex, 1);
      }

      nextPagination.deploys.unshift(deploy.id);
      nextPagination.total++;
      nextPagination.totalPages = Math.ceil(nextPagination.total / nextPagination.limit);
      return {...state, map: nextMap, pagination: nextPagination};
    }

    case types.LOAD_LOG_SUCCESS:
      return updateDeploy(state, action.payload.deployId, 'log', action.response);

    default:
      return state;
  }
}

export default reducer;
