import {get, post} from '../utils/fetch';
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
    const action = {type: routerTypes.STACK, payload: {stack}};
    if (page > 1) action.payload.query = {page};
    return action;
  },
  startDeploy: asyncActionCreator(types.START_DEPLOY, 'slug', 'branch', 'targets', {
    client: async (payload, {resetForm, setErrors}) => {
      try {
        const response = await post('/api/deploys', payload);
        resetForm();
        return response;
      }
      catch (error) {
        setErrors(error.response.data);
      }
    },
    schema: Deploy.normalizedSchema
  }),
  loadLog: asyncActionCreator(types.LOAD_LOG, 'deployId', ({deployId}) => {
    return get(`/api/deploys/${deployId}/log`);
  })
};
