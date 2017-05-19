import {get, post} from 'ftchr';
import Deploy from '~/domain/deploy/Deploy';
import {actionCreator, asyncActionCreator, async, createTypes} from 'redux-action-creator';
import {getDeploys} from './selectors';

export const types = createTypes([
  'TOGGLE_DEPLOY_DETAILS',
  'ADD_LOG_LINE',
  ...async('START_DEPLOY'),
  ...async('LOAD_DEPLOYS_BRANCHES'),
  ...async('LOAD_LOG')
], 'DEPLOYS');

export const actions = {
  toggleDeployDetails: deploy => (dispatch, getState) => {
    dispatch({type: types.TOGGLE_DEPLOY_DETAILS, payload: {deploy}});
    if (!deploy.log) {
      // TOGGLE_DEPLOY_DETAILS will change deploy so need instance in new state
      const deploys = getDeploys(getState());
      dispatch(actions.loadLog({deploy: deploys[Object.keys(deploys).find(index => deploys[index].id === deploy.id)]}));
    }
  },
  addLogLine: actionCreator(types.ADD_LOG_LINE, 'deploy', 'line'),
  startDeploy: asyncActionCreator(types.START_DEPLOY, {
    client: ({stack, branch, targets}) => post('/api/deploys', {slug: stack.slug, branch, targets}),
    schema: Deploy.normalizedSchema
  }),
  loadDeploysAndBranches: asyncActionCreator(types.LOAD_DEPLOYS_BRANCHES, {
    client: ({slug, page}) => get(`/api/deploys/${slug || ''}`, {page}),
    server: ({slug, page, injector}) => injector.get(require('~/application/DeployService')).loadDeploysAndBranches(slug, page),
    schema: {pagination: {deploys: [Deploy.normalizedSchema]}}
  }),
  loadLog: asyncActionCreator(types.LOAD_LOG, ({deploy}) => get(`/api/deploys/${deploy.id}/log`))
};
