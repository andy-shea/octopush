import {get, post} from '~/infrastructure/fetch';
import action from '../action';
import Deploy from '~/domain/deploy/Deploy';
import {asyncActionCreator, async, createTypes} from 'redux-action-creator';
import {getDeploys} from './selectors';
import {types as routerTypes} from '../router/routes';

export const types = createTypes(
  ['TOGGLE_DEPLOY_DETAILS', 'ADD_LOG_LINE', ...async('START_DEPLOY'), ...async('LOAD_LOG')],
  'DEPLOYS'
);

export const actions = {
  toggleDeployDetails: deploy => (dispatch, getState) => {
    dispatch({type: types.TOGGLE_DEPLOY_DETAILS, payload: {deploy}});
    if (!deploy.log) {
      // TOGGLE_DEPLOY_DETAILS will change deploy so need instance in new state
      const deploys = getDeploys(getState());
      dispatch(
        actions.loadLog({
          deployId: deploys[Object.keys(deploys).find(index => deploys[index].id === deploy.id)].id
        })
      );
    }
  },
  loadDeploys: (stack, page = 1) => {
    const loadDeploysAction = {type: routerTypes.STACK, payload: {stack}};
    if (page > 1) loadDeploysAction.payload.query = {page};
    return loadDeploysAction;
  },
  startDeploy: asyncActionCreator(types.START_DEPLOY, 'slug', 'branch', 'targets', {
    client: action(payload => post('/api/deploys', payload)),
    schema: Deploy.normalizedSchema
  }),
  loadLog: asyncActionCreator(types.LOAD_LOG, 'deployId', ({deployId}) => {
    return get(`/api/deploys/${deployId}/log`);
  })
};
