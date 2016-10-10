import React, {Component} from 'react';
import {asyncConnect} from 'redux-connect';
import {actions} from './actions';
import {isAuthenticated} from '../users/selectors';
import DeploySettingsContainer from './DeploySettingsContainer';
import DeployListContainer from './DeployListContainer';

const asyncItems = [{
  promise: ({params, store: {getState, dispatch}, helpers = {}}) => {
    if (isAuthenticated(getState())) {
      return dispatch(actions.loadDeploysAndBranches(params.stack, 1, helpers.injector));
    }
  }
}];

@asyncConnect(asyncItems)
class DeployContainer extends Component {

  render() {
    return (
      <div>
        <DeploySettingsContainer/>
        <DeployListContainer/>
      </div>
    );
  }
}

export default DeployContainer;
