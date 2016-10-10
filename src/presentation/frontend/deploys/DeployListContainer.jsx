import React, {Component, PropTypes} from 'react';
import autobind from 'autobind-decorator';
import {connect} from 'react-redux';
import {actions} from './actions';
import DeployList from './DeployList';
import {getDeploys, getDeployUsers, getPagination, getIsLoading} from './selectors';
import {getCurrentStack} from '../stacks/selectors';

function mapStateToProps(state) {
  return {
    currentStack: getCurrentStack(state),
    deploys: getDeploys(state),
    pagination: getPagination(state),
    users: getDeployUsers(state),
    isLoading: getIsLoading(state)
  };
}

@connect(mapStateToProps, {...actions})
class DeploysContainer extends Component {

  static propTypes = {
    toggleDeployDetails: PropTypes.func.isRequired,
    loadDeploysAndBranches: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    currentStack: PropTypes.object,
    deploys: PropTypes.array,
    pagination: PropTypes.object,
    users: PropTypes.object
  }

  @autobind
  loadDeploys({selected}) {
    const {currentStack: {slug}, loadDeploysAndBranches} = this.props;
    loadDeploysAndBranches(slug, selected + 1);
  }

  render() {
    const {isLoading, currentStack, deploys, pagination, users, toggleDeployDetails} = this.props;
    return (
      <DeployList isLoading={isLoading} stack={currentStack} pagination={pagination} loadDeploys={this.loadDeploys}
          toggleDeployDetails={toggleDeployDetails} deploys={deploys} users={users}/>
    );
  }
}

export default DeploysContainer;
