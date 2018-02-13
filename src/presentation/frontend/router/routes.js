import {redirect} from 'redux-first-router';
import querySerializer from 'query-string';
import {get} from '../utils/fetch';
import Deploy from '~/domain/deploy/Deploy';
import {getIsAuthenticated} from '../users/selectors';
import {async, createRouteTypes, asyncRoute} from 'redux-action-creator';

export const types = createRouteTypes(['LOGIN', ...async('STACK')]);

function isSecure(type, routesMap) {
  if (type === types.LOGIN || !routesMap[type]) return false;
  return routesMap[type].isSecure;
}

function createRoutesConfig(helpers) {
  return {
    map: {
      [types.LOGIN]: '/login',
      ...asyncRoute(types.STACK, '/:stack([a-z0-9\-]+)?', {
        isSecure: true,
        client: async ({stack, query}) => {
          const page = query ? query.page : 1;
          return get(`/api/deploys/${stack || ''}`, {page});
        },
        server: async ({stack}, dispatch, getState, {injector}) => {
          const DeployService = require('~/application/DeployService').default;
          const {location: {query = {page: 1}}} = getState();
          return injector.get(DeployService).loadDeploysAndBranches(stack, query.page);
        },
        schema: {pagination: {deploys: [Deploy.normalizedSchema]}}
      }, helpers)
    },
    querySerializer,
    onBeforeChange(dispatch, getState, {action}) {
      const state = getState();
      const {location: {routesMap, pathname, search}} = state;
      const routeIsSecure = isSecure(action.type, routesMap);
      if (routeIsSecure && !getIsAuthenticated(state)) {
        dispatch(redirect({
          type: types.LOGIN,
          query: {redirect: search ? `${pathname}?${search}` : pathname}
        }));
      }
    }
  };
}

export default createRoutesConfig;
