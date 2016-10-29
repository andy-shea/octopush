import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {actions} from './actions';
import DeploySettings from './DeploySettings';
import {getBranches, getMeta} from './selectors';
import {getCurrentStack, getStacks} from '../stacks/selectors';
import {getCurrentStackServers} from '../servers/selectors';

function mapStateToProps(state) {
  return {
    currentStack: getCurrentStack(state),
    branches: getBranches(state),
    stacks: getStacks(state),
    servers: getCurrentStackServers(state),
    meta: getMeta(state)
  };
}

@connect(mapStateToProps, {...actions})
class DeploySettingsContainer extends Component {

  static propTypes = {
    startDeploy: PropTypes.func.isRequired,
    meta: PropTypes.object,
    currentStack: PropTypes.object,
    branches: PropTypes.array,
    stacks: PropTypes.object,
    servers: PropTypes.object
  }

  render() {
    const {meta, currentStack, branches, stacks, servers, startDeploy} = this.props;
    return <DeploySettings meta={meta} stack={currentStack} stacks={stacks} servers={servers} branches={branches} startDeploy={startDeploy}/>;
  }
}

export default DeploySettingsContainer;
