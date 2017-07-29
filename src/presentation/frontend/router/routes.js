import {redirect} from 'redux-first-router';
import querySerializer from 'query-string';
import {get} from 'ftchr';
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
      ...asyncRoute(types.STACK, '/:stack?', {
        isSecure: true,
        client: async ({stack, page}) => {
          return get(`/api/deploys/${stack || ''}`, {page});
        },
        server: async ({stack, page}, dispatch, getState, {injector}) => {
          const DeployService = require('~/application/DeployService').default;
          return injector.get(DeployService).loadDeploysAndBranches(stack, page);
        },
        schema: {pagination: {deploys: [Deploy.normalizedSchema]}}
      }, helpers)
    },
    querySerializer,
    onBeforeChange(dispatch, getState, action) {
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
