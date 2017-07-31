import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import {connect} from 'react-redux';
import {actions} from './actions';
import DeployList from './DeployList';
import {getDeploys, getDeployUsers, getPagination, getIsLoading} from './selectors';
import {getCurrentStack} from '../stacks/selectors';

const handlers = withHandlers({
  loadDeploys: props => ({selected}) => {
    const {stack: {slug}, loadDeploys} = props;
    loadDeploys(slug, selected + 1);
  }
});

function mapStateToProps(state) {
  return {
    stack: getCurrentStack(state),
    deploys: getDeploys(state),
    pagination: getPagination(state),
    users: getDeployUsers(state),
    isLoading: getIsLoading(state)
  };
}

const DeploysListContainer = compose(connect(mapStateToProps, actions), handlers)(DeployList);

export default DeploysListContainer;
